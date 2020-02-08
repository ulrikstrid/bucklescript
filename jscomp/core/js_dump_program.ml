(* Copyright (C) 2017 Authors of BuckleScript
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * In addition to the permissions granted to you by the LGPL, you may combine
 * or link a "work that uses the Library" with a publicly distributed version
 * of this file to produce a combined library or application, then distribute
 * that combined work under the terms of your choosing, with no requirement
 * to comply with the obligations normally placed on you by section 4 of the
 * LGPL version 3 (or the corresponding section of a later version of the LGPL
 * should you choose to use a later version).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA. *)

module P = Ext_pp
module L = Js_dump_lit 




let empty_explanation = 
  "/* This output is empty. Its source's type definitions, externals and/or unused code got optimized away. */\n"

let program_is_empty (x : J.program) = 
  match x with 
  | {
    block = [];
    exports = [];
    export_set = _
  }  -> true 
  | _  -> false  

let deps_program_is_empty (x : J.deps_program) = 
  match x with 
  | { modules = [];
      program ;
      side_effect = None
    } -> program_is_empty program
  | _ -> false 

let rec extract_block_comments acc (x : J.block) = 
  match x with 
  | {statement_desc = Exp {expression_desc = Raw_js_code {code ; code_info = Stmt (Js_stmt_comment)}} } :: rest
      -> extract_block_comments (code :: acc) rest 
  | _ -> (acc ,x)


let extract_file_comments  (x : J.deps_program) = 
  let comments, new_block = extract_block_comments [] x.program.block in 
  comments , {x with program = {x.program with block = new_block}}
    




let program f cxt   ( x : J.program ) = 
  P.force_newline f;
  let cxt =  Js_dump.statement_list true cxt f x.block  in
  P.force_newline f;
  Js_dump_import_export.exports cxt f x.exports

let dump_program (x : J.program) oc = 
  ignore (program (P.from_channel oc)  Ext_pp_scope.empty  x )


let node_program ~output_dir f ( x : J.deps_program) = 
  P.string f L.strict_directive; 
  P.newline f ;
  let cxt = 
    Js_dump_import_export.requires 
      L.require
      Ext_pp_scope.empty
      f
      (Ext_list.map x.modules 
         (fun x -> 
            Lam_module_ident.id x,
            Js_name_of_module_id.string_of_module_id 
              x
              ~output_dir
              NodeJS 
         ))
  in
  program f cxt x.program  




let es6_program  ~output_dir fmt f (  x : J.deps_program) = 
  let cxt = 
    Js_dump_import_export.imports
      Ext_pp_scope.empty
      f
      (Ext_list.map x.modules
         (fun x -> 
            Lam_module_ident.id x,
            Js_name_of_module_id.string_of_module_id x ~output_dir
              fmt 
              ))
  in
  let () = P.force_newline f in 
  let cxt = Js_dump.statement_list true cxt f x.program.block in 
  let () = P.force_newline f in 
  Js_dump_import_export.es6_export cxt f x.program.exports



(** Make sure github linguist happy
    {[
      require('Linguist')
        Linguist::FileBlob.new('jscomp/test/test_u.js').generated?
    ]}
*)

let pp_deps_program
    ~(output_prefix : string)
    (kind : Js_packages_info.module_system )
    (program  : J.deps_program) (f : Ext_pp.t) = 
  if not !Js_config.no_version_header then 
    begin 
      P.string f Bs_version.header;
      P.newline f
    end ; 
  if deps_program_is_empty program then 
    P.string f empty_explanation 
    (* This is empty module, it won't be referred anywhere *)
  else 
    let comments, program = extract_file_comments program  in 
    Ext_list.rev_iter comments (fun comment -> P.string f comment; P.newline f) ;
    let output_dir = Filename.dirname output_prefix in   
    begin 
      ignore (match kind with 
          | Es6 | Es6_global -> 
            es6_program ~output_dir kind f program
          | NodeJS -> 
            node_program ~output_dir f program
        ) ;
      P.newline f ;
      P.string f (
        match program.side_effect with
        | None -> "/* No side effect */"
        | Some v -> Printf.sprintf "/* %s Not a pure module */" v );
      P.newline f;
      P.flush f ()
    end



let dump_deps_program
    ~output_prefix
    kind
    x 
    (oc : out_channel) = 
  pp_deps_program ~output_prefix  kind x (P.from_channel oc)

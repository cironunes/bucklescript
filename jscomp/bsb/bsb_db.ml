
(* Copyright (C) 2015-2016 Bloomberg Finance L.P.
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

type case = bool
(** true means upper case*)

type ml_kind =
  | Ml_source of string  * bool  * case (*  Ml_source(name, is_re) default to false  *)
  | Ml_empty
type mli_kind = 
  | Mli_source of string * bool  * case  
  | Mli_empty

type module_info = 
  {
    mli : mli_kind ; 
    ml : ml_kind ; 
  }


type t = module_info String_map.t 
type ts = t array 
(** indexed by the group *)

let module_info_magic_number = "BSBUILD20170802"

let dir_of_module_info (x : module_info)
  = 
  match x with 
  | { mli; ml;  } -> 
    begin match mli with 
      | Mli_source (s,_,_) -> 
        Filename.dirname s 
      | Mli_empty -> 
        begin match ml with 
          | Ml_source (s,_,_) -> 
            Filename.dirname s 
          | Ml_empty -> Ext_string.empty
        end
    end

let filename_sans_suffix_of_module_info (x : module_info) =
  match x with 
  | { mli; ml;  } -> 
    begin match mli with 
      | Mli_source (s,_,_) -> 
        s 
      | Mli_empty -> 
        begin match ml with 
          | Ml_source (s,_,_)  -> 
            s 
          | Ml_empty -> assert false
        end
    end

let bsbuild_cache = ".bsbuild"    

let write_build_cache ~dir (bs_files : ts)  = 
  let oc = open_out_bin (Filename.concat dir bsbuild_cache) in 
  output_string oc module_info_magic_number ;
  output_value oc bs_files ;
  close_out oc 

let read_build_cache ~dir  : ts = 
  let ic = open_in_bin (Filename.concat dir bsbuild_cache) in 
  let buffer = really_input_string ic (String.length module_info_magic_number) in
  assert(buffer = module_info_magic_number); 
  let data : ts = input_value ic in 
  close_in ic ;
  data 




let empty_module_info = {mli = Mli_empty ;  ml = Ml_empty}


let adjust_module_info x suffix name_sans_extension upper =
  match suffix with 
  | ".ml" -> {x with ml = Ml_source  (name_sans_extension, false, upper)}
  | ".re" -> {x with ml = Ml_source  (name_sans_extension, true, upper)}
  | ".mli" ->  {x with mli = Mli_source (name_sans_extension,false, upper) }
  | ".rei" -> { x with mli = Mli_source (name_sans_extension,true, upper) }
  | _ -> 
    Ext_pervasives.failwithf ~loc:__LOC__ 
      "don't know what to do with %s%s" 
      name_sans_extension suffix

let map_update ~dir (map : t)  
    file_name : t  = 

  let module_name, upper = 
    Ext_modulename.module_name_of_file_if_any_with_upper file_name in 
  let suffix = Ext_path.get_extension file_name in 
  let name_sans_extension = 
    Ext_path.chop_extension (Filename.concat dir file_name) in 
  String_map.adjust 
    module_name 
    (fun () -> 
       adjust_module_info 
         empty_module_info 
         suffix 
         name_sans_extension upper )
    (fun v -> 
       adjust_module_info v suffix name_sans_extension upper
    )
    map


let sanity_check (map  : t ) = 
  String_map.fold (fun k module_info has_re ->
      match module_info with 
      |  { ml = Ml_source(file1,is_re,ml_case); 
           mli = Mli_source(file2,is_rei,mli_case) } ->
        (if ml_case != mli_case then 
           Bsb_exception.invalid_spec
             (Printf.sprintf          
                "%S and %S have different cases"
                file1 file2));
        has_re || is_re || is_rei
      | {ml = Ml_source(_,is_re,_); mli = Mli_empty}
        -> has_re || is_re
      | {mli = Mli_source(_,is_rei,_); ml = Ml_empty}
        -> has_re || is_rei
      | {ml = Ml_empty ; mli = Mli_empty } -> has_re
    )  map false
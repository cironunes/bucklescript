
[@@@bs.config {
  flags = [|
  "-drawlambda";
  (* "-dlambda";  *)
  (* "-dtypedtree"; *)
  (* "-bs-diagnose" *)
  (* FIXME: empty array pattern match is fishy after fix array polymorphic error *)
  |]
}]

type 'a t = Fix of 'a t lazy_t

let rec fix () = Fix (lazy (fix ()))

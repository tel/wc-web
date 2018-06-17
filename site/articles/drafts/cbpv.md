---
title: The tension between values and computation
lang: en-US
meta:
  - name: description
    content: >
  - name: keywords
    content: > 
---

# {{ $page.title }}

Programming arises admist the tension between _values_ and _computation_,
_data_ and _behavior_, _representation_ and _work_, _doing_ and _being_.
Focusing on either one to the exclusion of the other fails, as does attempting
to blur the lines between them.

Fortunately, there are ways to bring that tenion into _focus_ and see how it
plays out. Doing so can create a lot of clarity about design decisions present
in langauges and their programs. It arms you with an analytical tool for
simplifying code.

In this article we will study Paul Blain Levy's **call-by-push-value**
calculus, a foundational programing language that gives precise meaning and
separation between computation and value. We'll also relate it to tensions that
exist in other programming languages and note how they have attempted to
"solve" these tensions using more precise language afforded by CBPV.

## Values and computation

Values, or data, are concrete, materialized _things_ defined by how they are
constructed and consumed by deconstruction. They are inherently _finite_ and
_transparent_.

Values themselves are incredibly rich. It's probably not wrong to say that most
of mathematics is built on language that struggles to consider a world of only
values. This is the reason mathematicians prefer total functions, assume
termination, refute things as undefined as opposed to dealing with them when
they fail. It's the reason programmers often dismiss mathematical thought as
impractical, but this doesn't prevent mathematics from saying amazingly rich
things.

Computation is also incredibly rich, but it is more difficult to imagine.
Computation is defined by its _elimination_, what happens when you feed it
different signals. It need not be finite, though it will only ever be finitely
observed.

Computation without data is action without language. Perhaps, the neural net
which provides answers to questions but is totally inscrutible. The control
system that keeps a rocket flying true via continuous adjustment. It's hard for
us to even see these as truely computation alone, though. We seek to qualify
the messages and inputs sent to each system in order to analyze its behavior,
and those messages are inherently data.

So more typically, we think of computation as a black box consuming data and
emitting it. It is an action, a behavior, inherently dynamic and inherently
opaque.

## Getting concrete

Data is defined by its construction. So, we can build a data list by showing
its construction

```
data list is
  nil : list
  cons : int -> list -> list

a-list : list
a-list = cons 1 (cons 2 (cons 3 nil))
```

Computation is defined by its response to prodding, so we define a computation
_stream_ by defining its behavior.

```
computation stream is
  pop : stream -> int * stream

counter : int -> stream
pop (counter n) = (n, counter (n + 1))
```

Sometimes we encode computations-as-values by embedding functions inside of our
data. Sometimes we encode data-as-computation by letting the computation
respond to messages so as to feign a finite nature. Both of these encodings try
to wash away the fact that programming arises as the _tension_ between these
two ideas.

So let's explore call-by-push-value which instead chooses to _highlight_ their
differences.

## Call by push value

The key thing in CBPV is that we have values and computations as separate, yet
interwoven, modalities in the language. 

- We _suspend_ a computation into a value explicitly by calling `thunk`,
- we _invoke_ a suspended computation by `force`ing it (and applying args, if
  it needs them)
- a computation _returns_ a value with `return`, and 
- a computation _receives_ a value from another computation by binding it with
  the phrase `c1 to x in E`.

Functions are a bit more complex, but we can see them as value-like or
computation-like essentially by whether they're _pure_ or not. We'll get into
that more in a minute, but it suffices to say a function can be made impure
even by effects as pervasive as non-termination. Our value-like functions are
_incredibly weak_.

```
-- let's call this a pure function since it has clearly terminating recursion
add = pure n m -> 
  case n of
    0      -> m
    Suc n' -> add n' (Suc m)

-- but we need to thunk this one, since it's not obvious that it terminates
collatz = thunk fn n ->
  case n of
    0 -> return 1
    1 -> return 1
    n -> if isEven n            
         then force div n 2 to n' 
              in force collatz n'
         else force collatz (add (times n 3) 1)
```

Above we witness decomposition of natural number values using pattern matching
on `Suc`, the application of pure functions like `isEven`, `add`, and `times`.
We also see an explicit call to a computation `div` with all of the ceremony it
entails (`force` and `_ to _ in _`). It's easy to design syntaxes to hide this
ceremony, but we'll leave it now as its explicitness is helpful.

<NoteBox title="On purity">

"Purity" is a tricky concept to nail down. You could call it computation in the
absense of side effects, but then "side effect" is tricky to nail down.

For purposes here, though, the nature of values give us a bright line. Any
expression made from values, fully-saturated value constructors (like `cons x
y`) and value-like functions must (in principle) represent exactly one
"canonical form" of a value. If we were being really technical we'd define all
of the canonical forms for each data type, but for now this just means that any
"value-like computation" is completely boring and proceeds from inputs to
outputs directly and transparently.

For this reason, it's actually quite reasonable to let implementations
calculate values lazily as all of this work must be transparent.

</NoteBox>

## Types in CBPV

Call-by-push-value also has a type system to help keep the worlds of values and
computation separate. Some types are "value types" and some are "computation
types" and the markers `F` and `U` help us discuss how `thunk`, `force`,
`return`, and `_ to _ in _` embed one world into the other.

We'll write `a : A` to indicate that `a` is a value of value-type `A` and `c »
C` to indicate `c` is a computation of computation type `C`.

So now we have rules for how `return` and `thunk` introduce `F` and `U`

- `a : A` implies `return a » F A` where `F` embeds value types into computation types
- `c » C` implies `thunk c : U C` where `U` embeds computation types into value types

and also rules for how `force` and `_ to _ in _` eliminate them

- `f : U C` implies `force f » C`
- if `m » F A` and `k » B` with a free variable `x : A`, then `m to x in k » B`

The typing rules enforce our understanding of how these 4 operations interact
and define strictly how the worlds of values and computations interleave and
combine.

With these in place, we can give types to our functions above:

```
add : Nat ~> Nat ~> Nat
collatz : U (Nat -> F Nat)
```

where we use `~>` to indicate pure functions and `->` to represent general
functions. In this case, `f : A ~> B` if `A` and `B` are value types and `g » A
-> C` if `A` is a value type and `C` a computation type.

This drives home how `add` and `collatz` are very different beasts. One is a
curried pure function and the other a complex "general" function with exposed
interactions between `F` and `U`.

```
isEven : Nat ~> Bool
times : Nat ~> Nat ~> Nat

div : U (Nat -> Nat -> F Nat)
```

Finally, we can state a very interesting property of this system: _variables
are only ever bound to value types_. This again works with the intuition that
variables _are_ while computations _do_.

<NoteBox title="On pure functions again">

One thing that you might ask is that if all values types have canonical forms
then what is the canonical form of `A ~> B`? 

And... that's a really good question that I'm just going to punt on. While
there are some ways to answer it, my whole introduction of "pure" functions
into this presentation is pretty much a hack.

</NoteBox>

## Relating to other languages

Call-by-push-value is totally explicit about the distinction between data and
computation, and therefore it gives us a language for exploring the design
decisions of other languages or even particular patterns in those languages.

### Haskell

One of the most important design decisions in Haskell is its laziness---by
default, all computation is done lazily.

On one hand, if we were to model that in CBPV we'd have to note that
computation (action!) can happen absolutely anywhere and all the time. By this
lens, Haskell biases very, very hard toward computation types. A standard
Haskell arrow might be encoded like `UA -> B` in CBPV. This turns a fundamental
principle of CBPV on its head: in Haskell, all variables bind _computations_
instead.

But this view is somewhat out of alignment with how most Haskell programs are
actually thought of. The best way to reason about pervasive laziness is not to
admit it as an effect and treat all things as computation, but instead to note
that the evaluation order of values doesn't much matter. Most of the time, you
treat Haskell as if it were _completely_ value-based with Haskell arrows
corresponding to `A ~> B` and computation ordering largely ignored.

To this end, we have to _model_ computations _as values_ in Haskell. This is
generally what monadic types `P a` are doing: representing computations as
value-like syntax trees to be interpreted later. We can see `IO a` as `U (F
a)`, so that something like `putStrLn` has type `String ~> U (F Unit)`.

Haskell's runtime system is the only place which has access to `force` and its
able to interpret the `IO` type where arbitrary computation might be hidden.

### OCaml

OCaml is a strict, data-oriented language. On its surface, you would expect
that it'd be proper to model it just the same as Haskell. Unfortunately, that's
not the case.

In particular, any given OCaml expression may be a computation. Once you
actually bind a variable it is a value, of course, but every `let x = f in E`
translates to `f to x in E`. OCaml arrows are thus described much like `div`
was as `U (A -> F B)` for value types `A` and `B`.

OCaml order of execution is unspecified and therefore there isn't a standard
translation into CBPV (where computations must be explicitly sequenced). If we
assume right-to-left evaluation, then we can translate something like

```ocaml
(print "arg 2"; readInt) + (print "arg 1?"; readInt)
```

as 

```
force print "arg 1?" to _ in
force readInt to x in
force print "arg 2?" to _ in
force readInt to y in
x + y
```

So, while Haskell actually works as computation everywhere, it makes you think
that it's values everywhere and computation just in a few locations. On the
other hand, OCaml actually just is computation everywhere.

### Java

The key idea in Java (and other OO languages) is the object, a container
holding both behavior and state. This is clearly a bundling of both data and
computation together, though it is usually the case that data is difficult to
access in Java.

The most obvious data available in Java are primitives and primitive arrays.
Every other type dispatches through `object` and thus has _behavior_ available,
_computation_.

Perhaps the most glaring evidence of this is the ambient `equals` method
available on all `object`s. Data can only be analyzed through examination of
its structure, so "reference equality" implies computational structure. Even
for Java classes which choose to implement some form of structural equality,
this is being emulated by defining how objects behave when they interact with
one another.

We can see classes as descriptions of computation types, listing out sets of
messages the instance is sensitive to and the computation that results, in
other words maps of symbolic names to arrows `A -> B` for value types `A` and
computation types `B`.

<NoteBox>

I'm going to just ignore Java's upcoming Value Types extension. Presumably,
it's being added because of pain caused by just how far Java goes to make
values inaccessible.

</NoteBox>

Java practices do sometimes involve emulation of data using objects (POJOs, the
visitor pattern), but these emulations always must go through interpretive
steps to create the appearance of data. It's difficult to talk about values
other than primitives.

That said, there is one other place where Java clearly represents data despite
its desire to make everything an object. It's valuable to think of objects as
being "prodded" by data as their input signals, and if you see method calls as
message passing then you can witness this data. This is especially clear when
using reflective interfaces where class names and method names become
strings---data being passed around by the JVM continuously.

### Scala

Finally, and most interestingly, we come to Scala which is designed as a fusion
between "functional" and "object oriented". Here, we can read this as
attempting to blur the lines between data-oriented programming and
object/computation oriented programming.

Scala is clearly built atop Java and so if we look closely its easy to see that
any pretense Scala has toward data-orientation is being emulated atop
computation. But assuming you're willing to suspend disbelief a bit, Scala's
case classes clearly are meant to represent data while classes retain their
object-oriented computational roots.

Function types are OCaml-like `U (A -> F B)`, but we can see that even more
explicitly since they are just objects (computations) which respond to `apply`
messages and input args `("apply", a: A)` and subsequently return some output.

Additionally, like OCaml, a faithful translation of most Scala expressions
involves the universal availability of effects.

In this sense, it's interesting that many Haskell practices have been adopted
by Scala as opposed to more OCaml practices as it has a closer computational
heritage. 

## HTTP and REST

And as a twist analysis, let's consider one of the most successful computation
systems today. As is typical with distributed systems, the tension becomes
incredibly straightforward as you cannot serialize computations, only concrete,
finite values.

While any HTTP endpoint is obviously a computation, opaque and analyzed by its
responses to various input signals, the various data interchange languages like
XML and JSON are obviously data. This is the typical case with interacting
computations---it's easier to analyze them if we see them as communicating with
observable, structural data.

REST takes this a step further and constrains the computations to be largely
about semi-transparent manipulation of known data. We expect various
"endpoints" to have straightforward behavior with respect to manipulations of
dependably available data. This is the sort of thing that brings data even more
into the forefront of interacting with these systems and, e.g., compares
interestingly with previous designs like RPC.

## Wrap up

Programming arises admist the tension between _values_ and _computation_. Once
you get an eye for the distinction between these two, you start seeing them
everywhere. Concepts like laziness and strictness, finite and infinite,
side-effect and purity, transparent and opaque, serializability and native all
start to be seen as consequences of this core tension.

Levy's call-by-push-value calculus intensifies the difference between the two
and playing with it (and various extensions) can help to train your sense for
how these two entities are distinct, and how they interact. For this reason, if
no other, it's a valuable thing to understand (though it's also an interesting
IR to consider during compilation).

Finally, and most importantly, this tension is the sort of thing that
transcends fashions in programming practice or language design. The tension is
not something that will go away so long as we endeavor to write interesting
programs, so the various ways that languages handle it are worth understanding
and contrasting.

## References and further reading

- ...

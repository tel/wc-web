---
title: "Exploring Frank: separating values and computation"
lang: en-US
meta:
  - name: description
    content: >
      A key perspective in programming is the separation of values and
      computation, but, awkwardly, nearly every tool in existence today
      conflates them. Frank is a toy language built by Sam Lindley, Conor
      McBride, and Craig McLaughlin and based on the work of Paul Blain Levy's
      "Call-by-push-value" execution semantics. It does a number of interesting
      things, but we'll explore how it makes complete separation of values and
      computation.
  - name: keywords
    content: > 
      call by push value, frank, sam lindley, lindley, conor mcbride, mcbride,
      craig mclaughlin, mclaughlin, paul blain levy, levy, values, computation,
      effects, effect handlers
---

# Exploring Frank: separating values and computation

Programming arises from the tension between _values_ and _computation_, _data_
and _behavior_, _representation_ and _work_, _doing_ and _being_. Language
designers and technique evangelists build their thesis of "How to Program Best"
off of "solutions" to this tension. These solutions tend to either promote a
method to ignore whichever side they find inconvenient or to blur the line
between the two.

Both of these methods ultimately fail because programming arises from the
distinction and tension of the two. Programs without data are conversations
without words, fundamentally limited to action without meaning. Surprisingly,
all of modern mathematics is programming without behavior, so data alone vastly
rich but limited to _modeling_ behavior alone, fundamentally _static_.

[_Frank_](https://github.com/frank-lang/frank) is a toy programming language
built by Sam Lindley, Conor McBride, and Craig McLaughlin. It combines aspects
of Plotkin, Power, and Pretnar's work on effect algebras, handlers, and type
systems with Paul Blain Levy's
[_Call-by-push-value_](http://www.cs.bham.ac.uk/~pbl/cbpv.html) calculus
merging call-by-name and call-by-value semantics.

Name and link and fancy concept dropping aside, Frank is interesting because it
takes the tension between values and computation _very seriously_. Let's
investigate.

(If you want to follow along, you can download and build the Frank compiler at
[https://github.com/frank-lang/frank](https://github.com/frank-lang/frank))

## Basic Frank

Frank's syntax is Haskell-like, but the similarities end quickly. In
particular, Frank is strict and therefore every variable is bound to a
concrete, totally materialized _value_.

```
-- data declarations give us constructors to define new primal values
data Dir = up | down | left | right

-- or composite, even recursive values
data Pair X Y = pair X Y
data Maybe X = just X | nothing
data Tree A = node A (List (Tree A))

main! = let a = 3 in                    -- ints are built-in
        let b = [1, 2, 3] in            -- lists are built-in
        let c = pair "foo" "bar" in     -- strings are built-in
        let d = just (pair 1 up) in ... -- and we nest things, of course
```

What begins to show Frank's uniqueness is that amongst those values are
_suspensions_, computations not yet executed. You might imagine these as being
the source code to a program not yet run. We execute them by postpending a `!`.

```
doTimes 0 _ = unit
doTimes n c = c! ; doTimes (n-1) c
```

Here `unit` is the only value of the type `Unit` and `c` has type `{Unit}`
which means a "suspended computation, returning a _value_ of type `Unit`". Note
also that semicolon could be user-defined as

```
semi a b = b
```

since Frank is strict, it will evaluate `a` and `b` before returning `b`. It's
up to us to force computation with `!`. Since we have fine-grained control over
execution, it's easy to write `if` ourselves.

```
if true thn _ = thn!
if false _ els = els!
```

## On doing and being

Frank is a strict language and all of its variables denote concrete,
materialized values. The inclusion of "suspensions" as a possible value however
brings _computation_ into play as a first class idea. Suspensions make the
performance of computation completely explicit.

Thus, Frank is explicit about the distinction between values and computation,
drawing a bright line between them with `!`. Frank's type system enforces that
these worlds never become blurred.

This is the nature of Call-by-push-value: values and computations are held
seperately both syntactically and by the type system. On the other hand, they
are intrinsically linked as computations return (and are parameterized by)
values and values _embed_ and _invoke_ computations.

Since they are distinguished the language can handle value and computation
differently. Frank ultimately is focused on letting computations be defined by
their _effects_. It introduces the CBPV digide because the nature of values is
not compatible with effects, so (effectful) computations need to be discussed
explicitly.

This distinction could be exploited in other ways, too. For instance, values
are timeless, characterized only by their structure. This might allow the value
like components of a language (along with the pure functions manipulating them)
to be lazily constructed and reordered while ensuring that the embedded
computations remain strict.

## Describing computation

What is computation anyway?

In other languages, it's something happening all of the time, pervasively. It
is the motion of your program forward, the ghost in the machine.

In Frank, it's defined by the construction of a suspension and then this
suspension is _invoked_ to drive a computation forward, resulting a new, static
value. This invocation sets exact bounds for the computation that occurs.

```
computeAnInt : {String}
computeAnInt! = let read = readString! in read
```

Cutely, we don't define the computation `computeAnInt` directly but instead the
effect of its invocation `computeAnInt!`. Computation can invoke other
computation as well like the `readString` computation. Upon invocation,
computation flows inexorably to the final result value.

## Functions

By this point it should be clear that the functions defined at the beginning
are themselves computations. Only computations without arguments need the
invocation `!`, others begin as soon as we provide them the arguments they
need.

<NoteBox>

Awkwardly, this means that despite punning on Haskell's syntax, we don't have
immediate access to partial application—all function applications have to be
fully saturated or explicitly wrapped in a lambda.

</NoteBox>

We can also see this in the type of functions and the syntax for lambdas. The
functions defined above are inferred, but could have their types written as

```
doTimes : {Int -> {Unit} -> Unit}
doTimes 0 _ = unit
doTimes n c = c! ; doTimes (n-1) c

semi : {X -> Y -> Y}
semi a b = b

if : {Bool -> {X} -> {X} -> X}
if true thn _ = thn!
if false _ els = els!
```

Really, the name-with-args definition syntax is just short for synatx written
by an explicit suspension lambda (though, the compiler actually doesn't appear
to accept this equivalence for top-level bindings). We can write a suspension
that consumes a value and returns it unchanged as `{x -> x}`.

We can also pattern match

```
-- emits [up, right, down]
main : {List Dir}
main! = map { up -> right
            | right -> down
            | down -> left
            | left -> up
            } [left, up, right]
```

What this might say is that in Frank, analysis of a value is computation. This
also matches with conventions such as in GHC Core where `let`s are lazy and
`case`s imply computation.

## Is there anything really new here?

Hold up, though. So far, I've just said that "functions are suspensions and
application is its invocation". Even the nullary suspensions like `{Int}` are
obviously encoded as `Unit -> Int` in any old strict language. Did Frank do
anything special at all?

The importance of "taking the tension seriously" arises from their
interactions. Frank is actually mostly focused on a different sort of tension
I've ignored so far (effect systems), but `if` above demonstrates this tension:
in particular, we cannot write the "bad if" you might want to in other
languages.

```
if : {Bool -> X -> X -> X}
if true  thn _ = thn
if false _ els = els
```

In something like OCaml, the issue with an `if` defined this way is that `if
true (print "hi") (print "bye")` will print both `"hi`" and `"bye"` and, more
than that, _we don't know in which order they'll print._ Technically, these are
all bad but the last is worse because it points out an interaction between
unspecified behavior in the language and the meaning of your programs.

## Wrap-up

This has been just a quick dive into the ways that Frank takes the separation
of value and computation seriously. The core call-by-push-value calculus that
Frank is built upon interleaves dynamic computation and static values making
the domain of each clear.

If you investigate Levy's writeups on CBPV you can learn a lot more about what
it means to take this divide seriously, but it's also a lot more mathy and
complex. Learning a bit of Frank is convenient because you can get the basic
ideas much more quickly using a working language with a refined syntax.

This isn't everything interesting in Frank—it's actually completely avoiding
the most important feature of Frank, it's effect typing system and handlers—but
I'll have to discuss these a different time.

Think of this instead as a jumping off point, though. Keeping this distinction
straight can help make abstraction and design in any language more clear. It's
also the foundation for a number of other ideas of programming. Finally, it
challenges somewhat the "world of values" often touted as principle in
mathematics and functional programming circles.

## References and further reading

- _Lindley, S., McBride, C., & McLaughlin, C. (2016)_. [**Do be do be
  do**.](http://arxiv.org/abs/1611.09259)
- _Plotkin, G. D., & Pretnar, M. (2013)._ [**Handling Algebraic
  Effects**](https://arxiv.org/abs/1312.1399). Logical Methods in Computer
  Science, 9(4), 1–44.
- _Levy, P. B. (2006)._ [**Call-by-push-value: Decomposing call-by-value and
  call-by-name**](https://www.semanticscholar.org/paper/Call-by-push-value%3A-Decomposing-call-by-value-and-Levy/3e61e330be5634c1865b10805128f5fa3b00b188).
  Higher-Order and Symbolic Computation, 19(4), 377–414.
  ttps://doi.org/10.1007/s10990-006-0480-6

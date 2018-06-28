---
title: Theories and models
lang: en-US
meta:
  - name: description
    content: >
  - name: keywords
    content: > 
---

# {{ $page.title }}

The concept of _theories_ and _models_ is a powerful tool for understanding
important programming ideas like interfaces and implementations, DSL design,
reification and automation, and even programming languages themselves. Really,
theories and models help to show how all of these are different views of the
same thing.

More than this, the tension between theory and model is the critical tension of
creative abstraction, generalization, and synthesis. Getting a good handle on
this idea will cause echoes throughout your programming work.

[[toc]]

## Theories and models

A theory is an external description of a class of things that captures the
_essential nature_ shared by that whole class. A model of a theory is _one of
those things_, or, equivalently, a concrete construction which is accurately
described by the theory.

As an example, let's consider the theory of monoids. To talk about a theory we
provide a "presentation" of the theory which looks like the following

<NoteBox title="The theory of monoids">

A type $M$ closed under the operations 

- $unit$ and 
- $a \diamond b$ for all $a, b \in M$

following the laws

- (_left identity_) for all $a \in M$, $unit \diamond a = a$
- (_right identity_) for all $a \in M$, $a \diamond unit = a$
- (_associativity_) for all $a, b, c \in M$, $(a \diamond b) \diamond c = a \diamond (b \diamond c)$

</NoteBox>

In reading this note that it consists of 3 parts

- a declaration of the involved types (or sets)
- a set of operations (means of introduction)
- a set of laws (equalities)

and that the operations (here: $unit$ and $\_ \diamond \_$) are just abstract
names. They are given meaning by the theory iteself.

This abstract presentation of a theory can be modeled in some programming
languages. For instance, in Scala we can write a trait.

```scala
trait MONOID {
  type M

  def unit: M
  def combine(a: M, b: M): M
}
```

though the laws would need to just be specified in a comment.

A model of this theory is a concrete instantiation of it. In particular, we need to 

- give a concrete definition for $M$,
- define all of the operations, and
- prove that the definition of $M$ and its operations satisfy all of the laws

There are many models of the theory of monoids. Here are a few

<NoteBox title="The monoid of addition">

Let $M$ by the set of all integers and define 

- $unit$ as $0$ and 
- $a \diamond b$ as $a + b$.

</NoteBox>

<NoteBox title="The monoid of multiplication">

Let $M$ by the set of all integers and define 

- $unit$ as $1$ and 
- $a \diamond b$ as $a \times b$.

</NoteBox>

You can probably trivially prove that the law equations hold for these models.
More interestingly, we can have families of models

<NoteBox title="The family of monoids of lists, one for each type A">

Let $M$ be the type of lists of values of type $A$ and define

- $unit$ to be the empty list and
- $a \diamond b$ to be the concatenation of lists $a$ and $b$

</NoteBox>

We can give these models as Scala `val`s and `def`s

```scala
val AdditionModel: MONOID { type M = Int } =
  new MONOID {
    type M = Int
    val unit = 0
    def combine(a: M, b: M): M = a + b
  }

val MultiplicationModel: MONOID { type M = Int } =
  new MONOID {
    type M = Int
    val unit = 1
    def combine(a: M, b: M): M = a * b
  }

def ListModel[A]: MONOID { type M = List[A] } =
  new MONOID {
    type M = List[A]
    val unit = List.empty[A]
    def combine(a: M, b: M): M = a ++ b
  }
```

For these, I could have used `object` and `class` definitions, but it is
cleaner to use type ascription like `Model: THEORY` rather than `extends`. Also
note that we use a refinement type to expose the meaning of `M`.

<ArticleMeta />

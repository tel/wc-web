---
title: Theories and models
lang: en-US
meta:
  - name: description
    content: >
      The concept of theories and models is an important, explicit notion from
      mathematics that helps us to discuss abstraction precisely. We introduce
      and explore the idea in the context of some programming examples.
      Ultimately, this is a great tool for DSL design. 

  - name: keywords
    content: > 
      theory, model, model theory, lawvere theory, dsls, edsls, domain specific
      languages, abstraction, specialization, structure, signature, ml, sml,
      ocaml, scala, haskell, typeclasses

---

# {{ $page.title }}

The concept of _theories_ and _models_ is a powerful tool for understanding
important programming ideas like interfaces and implementations, DSL design,
reification and automation, and even programming languages themselves. Really,
theories and models help to show how all of these are different views of the
same thing.

More than this, the tension between theory and model is the critical tension of
creative abstraction, generalization, and synthesis. Getting a good handle on
this idea can make some pieces of the nebulous, creative process of programming
more tangible.

In this article I'll define theories and models and give a few examples.
I'll also sketch out processes for moving from collections of models to
a theory and from a designed theory onward to its models.

[[toc]]

## Theories and models

A theory is an external description of a class of things that captures the
_essential nature_ shared by that whole class. A model of a theory is _one of
those things_, or, equivalently, a concrete construction which is accurately
described by the theory.

As an example, let's consider the theory of monoids. To talk about a theory we
provide a "presentation" of the theory which looks like the following

<CalloutBox title="The theory of monoids">

A type $M$ closed under the operations 

- $\text{unit}$ and 
- $a \diamond b$ for all $a, b \in M$

following the laws

- (_left identity_) for all $a \in M$, $\text{unit} \diamond a = a$
- (_right identity_) for all $a \in M$, $a \diamond \text{unit} = a$
- (_associativity_) for all $a, b, c \in M$, $(a \diamond b) \diamond c = a \diamond (b \diamond c)$

</CalloutBox>

In reading this note that it consists of 3 parts

- a declaration of the involved types (or sets)
- a set of operations (means of introduction)
- a set of laws (equalities)

and that the operations (here: $\text{unit}$ and $\_ \diamond \_$) are
just abstract names. They are given meaning by the theory iteself.

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

<NoteBox title="About typeclasses">

The "typeclass" pattern as implemented explicitly in Haskell or modeled by
Scala's implicits system is doing approximately the same thing as what this
article is discussing. Feel free to port all of the ideas over to that
formulation if it's more familiar.

</NoteBox>

A model of this theory is a concrete instantiation of it. In particular, we need to 

- give a concrete definition for $M$,
- define all of the operations, and
- prove that the definition of $M$ and its operations satisfy all of the laws

There are many models of the theory of monoids. Here are a few

<CalloutBox title="The monoid of addition">

Let $M$ by the set of all integers and define 

- $\text{unit}$ as $0$ and 
- $a \diamond b$ as $a + b$.

</CalloutBox>

<CalloutBox title="The monoid of multiplication">

Let $M$ by the set of all integers and define 

- $\text{unit}$ as $1$ and 
- $a \diamond b$ as $a \times b$.

</CalloutBox>

You can probably trivially prove that the law equations hold for these models.
More interestingly, we can have families of models

<CalloutBox title="The family of monoids of lists, one for each type A">

Let $M$ be the type of lists of values of type $A$ and define

- $\text{unit}$ to be the empty list and
- $a \diamond b$ to be the concatenation of lists $a$ and $b$

</CalloutBox>

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

## The essence of abstraction

Typically, we start with things that are concrete—models—and discover
theories which explain their key behavior only later. It's not usually the
case that we just develop a theory out of the blue.

Instead, theories arise through careful stripping away of inessential
details from a collection of models. For instance, the theory of monoids
above arises from noting the repeating pattern of certain operations
available on several familiar, concrete types. Each of $(+)$, $(\times)$,
and list concatenation are _associative_ and the theory of monoids allows
us to focus intently on that.

Once you've created a theory—and carefully tuned it to really focus on
just the part you want—you are able to speak to the properties of every
model at once. Generally, this arises from taking properties you're
familiar with from a given model of the theory and seeing if you can
"port" them to work on theory itself.

This is the essence of abstraction, and when it's done like this the
properties of theories translate perfectly to their models. Programmers
are often familiar with the notion of the "leaky abstraction". In fact,
often people believe that all abstractions are "leaky" in that they may
contain sharp edges and fail unexpectedly.

Focusing on the notions of the theories and models helps you to design
leak-free abstractions. By recognizing the operations and laws of your
theory and proving that the models satisfy them, you establish equivalence
at the strength of your laws.

## Ways theories can fail

Theories can fail by becoming _inconsistent_. This arises when their laws
are so restrictive that no models exist. Typically, this isn't an issue
because we've designed our theory with several models in mind and tuned it
so that everything remains in alignment. That said, there are still times
when it's useful to try to develop something "theory first" without
concrete models in mind. 

Theories can also fail by being _incomplete_ if they don't actually cover some
interesting model like you wish they did. This arises when their operations are
too weak, but in practice it's rarer to see. Usually, we're pretty good at
making our theories powerful and big enough.

In practice, the more frequent issue is when working "theory first" you find
it's just _difficult_ to find a model. This is a common feeling in programming
again where you can design the API you love, but then struggle to implement it.

## Theory-first case study: DSL design

A common situation where this arises is in DSL design where the shape of
your language takes form first by considering the domain of the problem
and the human-factors design of the language. You decide _what_ you want
to say before you figure out _how_ it'll be said.

This is "theory first" because we'll decide the operations of our language
and likely have a sense for rules for how they interact well before we
know how things are going to actually work.

### Account ledgers

For instance, imagine the theory of a (very trivial) account ledger. The
ledger may contain atomic transactions like $\text{add}(a)$ and
$\text{subtract}(b)$ and have them be glued together with an associative
operation $e_1 ; e_2$. We're concerned about the account remaining
positive, so any given $\text{subtract}$ operation could fail, but
$\text{add}$s cannot, and we have laws like

$$ \text{add}(a) ; \text{add}(b) = \text{add}(a + b) $$

This actually "hoists" a whole set of laws up from the properties of
addition. For instance, we know that $\text{add}(a); \text{add}(b)
= \text{add}(b) ; \text{add}(b)$.

It's probably clear that ledgers like this have as a model a list of
numbers, positive representing $\text{add}$s and negative representing
$\text{subtract}$s, but we may very well want to specify behavior like
above before getting caught up in the specifics of a model. For instance,
in this list-of-numbers model, how do we handle $0$? Is it an
$\text{add}$?

### Graphics

Another popular theory is a grammer of graphics. For this, we create a set
of atomic parameterized "shapes" like $\text{rectangle}(width, height)$
and $\text{circle}(radius)$ and glue them together with operations like
$\text{above}(a, b)$ and $\text{beside}(a, b)$ which places the diagrams
$a$ and $b$ in the field either atop or next to one another.

```scala
trait GRAPHICS {
  type Img
  def circle(radius: Double): Img
  def rectangle(width: Double, height: Double): Imt
  def above(a: Img, b: Img): Img
  def beside(a: Img, b: Img): Img
}
```

Here the laws are a bit harder to define until we've added more
operations, but already we have a couple with rectangles

```scala
above(rectangle(a, b), rectangle(a, c)) = rectangle(a, b + c)
beside(rectangle(a, b), rectangle(c, b)) = rectangle(a + c, b)
```

This law demonstrates that we only care about what the `Img`s look
like—we're happy to forget two rectangles into one if it appears
identical.

But what is a model for `GRAPHICS`?

## Syntactic models

Finding models can be tough, but there is a mechanical process for getting
started. You can always begin with the "syntactic model"—the AST generated
by your operations. It is trivially guaranteed to support all of the
needed operations, but may fail to satisfy the laws.

```scala 
val SyntacticGraphics = new GRAPHICS {
  sealed abstract class Img
  final case class Circle(radius: Double) extends Img
  final case class Rectangle(width: Double, height: Double) extends Img
  final case class Above(a: Img, b: Img) extends Img
  final case class Beside(a: Img, b: Img) extends Img

  def circle(radius: Double): Img = Circle(radius)
  def rectangle(width: Double, height: Double): Img = Rectangle(width, height)
  def above(a: Img, b: Img): Img = Above(a, b)
  def beside(a: Img, b: Img): Img = Beside(a, b)
}
```

For simple laws, we can conform the syntactic model to our theory by being
careful with the constructors. For instance, here `above`, and `beside`,
could investigate their arguments to see if they're both `Rectangle`s.

```scala
def above(a: Img, b: Img): Img = (a, b) match {
  case (Recatangle(wa, ha), Rectangle(wb, hb)) if wa == wb =>
    Rectangle(wa, ha + hb)
  case _ => Above(a, b)
}
```

But for more complex laws this might not scale. We'll often find that the
syntactic model is no model at all: it is "too large".

## Laws are often up to interpretation

A common way of resolving this is to treat the syntactic model as
a language AST and "interpret" it into one or more meanings. These
meanings need not preserve _every_ property of the AST as long as they
capture some of them. For instance, we might create an "interpreter" which
tells us the width and height of the image.

```scala 
def width(a: Img): Double
def height(a: Img): Double
```

and then instead of expecting the laws to hold precisely, we ask them to
hold "up to observation" through each interpreter

```scala 
width(above(rectangle(a, b), rectangle(a, c))) = width(rectangle(a, b + c))
width(height(rectangle(a, b), rectangle(a, c))) = height(rectangle(a, b + c))
```

Interestingly, interpreters help us identify valid models. We now have two
models for `GRAPHICS`, one defined by width and one by height. For
instance, here's the "width model" and it clearly satisfies the `GRAPHICS`
laws we've described.

```scala 
val WidthModel: GRAPHICS { type Img = Double } = 
  new GRAPHICS {
    type Img = Double

    def circle(radius: Double): Img = radius * 2
    def rectangle(width: Double, height: Double): Img = width
    def above(a: Img, b: Img): Img = max(a, b)
    def beside(a: Img, b: Img): Img = a + b
  }
```

In practice, one might prefer to use the "syntactic model" for a while
even though it doesn't follow the laws since there may be multiple
law-abiding interpretations. A single construction of a value of `Img` can
then be interpreted in many valid ways.

In the world of embedded domain specific languages, the "syntactic model"
is often called a "deep embedding" and its interpretations "shallow
embeddings" and both have their uses.

## Wrap up

The concept of theories and models helps to make explicit the process of
abstraction and to give handles for doing it more effectively. Once you're
familiar with the idea, you'll see them everywhere and want to ask
questions about how a theory's laws are being satisfied.

Generally, the types, operations, and laws of a theory have to all fit
together and each one contributes an important component of the
functionality of the theory. Furthermore, models which are known to
support the operations and follow the laws can be considered "leak
free"—at least up to the properties truly locked in by the laws.

Interplay between the two is sometimes a process of abstraction from
a group of similar models to their master theory and sometimes a process
of "theory first" development where we choose the sort of words we'd like
to use and then go seeking interpretations of them.

<ArticleMeta />

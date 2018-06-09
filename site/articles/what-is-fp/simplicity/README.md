---
title: "Simplicity (What is FP?)"
lang: en-US
meta:
  - name: description
    content: Perhaps the key principle of FP is "simplicity", but what exactly does that mean? Simplicity in FP is designed as a balance between the richness of expression and the simplicity of the language you speak.
  - name: keywords
    content: functional programming, fp, principles, values, haskell, scala, ocaml, sml, erlang, racket, scheme, lisp, clojure, swift, practices, best practices, simplicity, parsimony, orthogonality, principle of least power, domain specific language, dsls
---

# Simplicity (What is FP?)

Functional programming is all about _simplicity_. Well, a certain kind of simplicity.

In particular, we seek simplicity that arises as a compromise: we want the power to make complex ideas simple to write and we want to achieve it using the simplest possible language. This creates a great **power-to-weight ratio** and helps us balance [creation and analysis](../creation-and-analysis/).

Simplicity defined like this makes programming into a practice of _compression_. We succeed best when we uncover new "thought technology" that unifies many existing cases and lets us speak to them using less complex language. Functional programming best practices often are built from the gems that survive this compression. 

<!-- (see "Generalization and Abstraction" and "Steal from Mathematicians") -->

Importantly, but counterintuitively, simplicity as its used here is **not** optimizing for the convenience of the user or the speed at which someone comes up to speed with an idea, the _ease of use_ of your product. Ease is also an important goal in the practice of software engineering, but it's best to view it as built atop a _simple_ foundation. Separating these two goals helps you achieve each more excellently (see [Rich Hickey's talk "Simple made easy"](https://www.youtube.com/watch?v=34_L7t7fD_U)).

<!-- (see "Theory over Metaphor") -->

## Domain specific languages

A critical technique for achieving simplicity is to control the language you program in. This _doesn't_ mean choosing to use several different general purpose languages (each being complex in its own right) but instead to be able to embed many simple languages within your base language: the practice of making **domain specific languages**, **DSLs**.

If you make practice of building DSLs to solve your problems then you can always right-size the DSL's power to the problem you're solving, creating locally optimal power-to-weight ratios. DSLs can often be weakened to the point of [having multiple semantic interpretations](../creation-and-analysis/). In practice, this means creating several interpretations for your DSL: usually one for production, one or more for testing, and one for semantics.

```
C, D := Circle radius
      | Rectangle height width
      | Beside C D
      | Atop C D
      | Rotate C degrees
```

For instance, a small DSL for drawing pictures can have 

- a production interpretation as a routine for drawing images on a screen, 
- a testing interpretation counting the number of entities drawn,
- another testing interpretation computing the minimal, rectilinear bounding box,
- a semantic interpretation of an actual picture you draw by hand,
- and a semantic interpretation as a series of primitives overlaid in space.

If this language is rich enough to draw the pictures you're interested in then you can exploit its simplicity to create interpreters that are efficient and correct.

Finally, since functional programming emphasizes the importance of DSLs it's important to use practices like embedded DSL design and reification which enables a programmer to fluently combine programs written in different DSLs.

## Minimize model complexity

Another way of thinking about functional programming simplicity is _the act of minimizing total description complexity._ Seen this way, simplicity is also an important principle in statistical modeling.

In statistics, we seek to design _models_ of the world that optimally _predict_ its behavior. You achieve this by _training_ a model using observed data (which costs money to gather).

It's well known that making a model more complex allows it to more powerfully simulate reality. Adding complexity to a model only ever _improves_ its ability to model its training data.

Unfortunately, this practice leads to _overfitting_ where a model becomes so specialized to the set of data it was trained on that it fails completely to generalize to new situations. It ended up modeling the idiosyncrasies of the data instead of the intended dynamics of the world. It also may lead to _suboptimality_ where you simply don't have enough training data to _substantiate_ the model, leading to random performance.

What you learn as a statistical modeler is that you need to simultaneously optimize for having the simplest possible model that still says interesting things about what you're trying to study. Anything else leads to great expense and complex failure.

In functional programming, we want to simultaneously optimize for having the simplest possible language that still makes saying interesting things easy. Failing to do this leads to a need to pay a great deal to prevent complex bugs and failures of our programs.

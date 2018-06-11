---
title: "Simplicity (What is FP?)"
lang: en-US
meta:
  - name: description
    content: >
      Perhaps the key principle of FP is "simplicity", but what exactly does
      that mean? Simplicity in FP is designed as a balance between the richness
      of expression and the simplicity of the language you speak.
  - name: keywords
    content: >
      functional programming, fp, principles, values, haskell, scala, ocaml,
      sml, erlang, racket, scheme, lisp, clojure, swift, practices, best
      practices, simplicity, parsimony, orthogonality, principle of least
      power, domain specific language, dsls
---

# Simplicity (What is FP?)

Functional programming at its core is _simplicity taken seriously_.

Total simplicity arises from a compromise: we want maximal expressive power
using the simplest language. This creates a great **power-to-weight ratio** and
helps us balance [creation and analysis](../creation-and-analysis/).
Importantly, you can't optimize each of these independently as they are in
tension. 

Functional programming takes simplicity seriously by choosing designs where
this tension is manageable and negotiable. We begin with a stripped-down
foundational language and increase expressive power as needed by layering
orthogonal domain specific extensions.

Seeking simplicity makes programming into a practice of _compression_.  We
succeed best when we uncover new "thought technology" and unify many existing
cases in reduced terms. Functional programming best practices are survivors of
this compression and are mined from both 40 years of programming research and
over a century of related mathematical research in logic and algebra.

<!-- TODO see "Generalization and Abstraction" and "Steal from Mathematicians" -->

## Simple is not easy

Often, simplicity of a language or API is confused with pleasant experiences as
a user or ease of learning the ropes. This kind of easiness is a function of
designing for human factors and it cannot be ignored in the craft of software
design, but it is not the same as simplicity.

Early optimization for user experience often leverages
[metaphor](../theory-over-analogy/) linking new technology and expected prior
experience. These metaphors often become orthogonality-breaking knots and when
they arise early in a design process they create great incidental complexity.

Instead, user experience and education journeys should be layered atop simple
designs. Metaphor becomes a teaching tool instead of a design principle.
Treating simplicity and ease of use separately allows greater excellence in
each.

See [Rich Hickey's talk Simple Made Easy](https://www.youtube.com/watch?v=34_L7t7fD_U).

## Domain specific languages

Simplicity is a function both of your program and the language it's written in;
therefore, optimizing it requires choices about the design of your language.

A critical method for changing the shape of your language is the use of
**domain specific languages**, **DSLs**. External or "deep" DSLs completely
extract smaller models or program fragments, but "shallow" and embedded DSLs
are better thought of as library APIs and are continuously mixed in and out of
use.

Practical DSL use involves using the smallest language extension (or tiniest
external DSL) "covering" your problem. Doing this regularly locally optimizes
power-to-weight ratios across your program. Asking for the weakest language
covering your problem provides access to [multiple semantic
interpretations](../creation-and-analysis/). In practice, this means creating
several interpretations for your DSL: one for production, several for testing,
and perhaps others for semantic clarity.

```
C, D := Circle radius
      | Rectangle height width
      | Beside C D
      | Atop C D
      | Rotate C degrees
```

A weak DSL for drawing pictures has

- a production interpretation as a routine for drawing images on a screen, 
- a testing interpretation counting the drawn entities,
- another testing interpretation computing the minimal bounding box,
- equational interpretations such as noting `Rotate (Circle r) d = Circle r`,
- a semantic interpretation as a picture you draw by hand,
- and a semantic interpretation as a list of primitives overlaid at spatial
  coordinates.

Such a weak language still covers many use cases while affording all of these
analytical outputs. It lives at a different point in the compromise of creation
and analysis and offers great benefits of linguistic simplicity.

On the other hand, some pictures can't be drawn so simply and demand extensions
or even totally new approaches. For these problems, linguistic simplicity is
overruled by the need for sophistication in the ideas it can express.

## Seeing languages everywhere

Focus on designing and using DSLs changes your perspective on all programming.
Every concept or library you use extends the sophistication of your language
and every one you elide increases its interpretability.

This perspective is powerful because it makes simplicity tradeoffs evident in
every line of code written in any codebase. It motivates the analysis of every
library and concept as a language where the power-to-weight ratio should be
measured.

Type theory and typed functional programming augments this perspective by
acting as tooling for analyzing languages and talking about them fluently.
These techniques are inherited from deep mathematical ideas in logic and
algebra such as [natural
deduction](https://en.wikipedia.org/wiki/Natural_deduction) and the study of
[theories](../theory-over-analogy/).

## Orthogonality

Complex languages often arise as a consequence of "complection"—tight, sophisticated
entwining—of subcomponents. Two ideas each simple on their own interact in
unexpected ways when combined making the whole untenable. 

When combining ideas we expect the resulting complexity to be a sum of its
parts, but when interactions are complex the result is multiplicative instead.
You don't just pay for each component, but instead for the component and all of
its interactions with other components.

When two components are totally independent, when using one does not impact the
motion of the other, they are _orthogonal_, they fall at "right angles".
Languages built from orthogonal pieces generate expressivity at lower costs.

One of the biggest offenders for causing non-orthogonality is exposed, shared
state. Shared state complects elements of a system by requiring multiple
systems be considered at once to verify each piece's invariants and properties.

Functional programming techniques aimed at creating orthogonal systems include
an emphasis on [values and immutability](../the-value-of-values/) as well as a
thorough practice of using modularity as derived from the theory of existential
types. Object oriented practice developed similar ideas around modularity, but
coupled them to the [metaphor](../theory-over-analogy/) of the object, limiting
the power of this idea.

<!-- TODO: link "composition" -->

## Minimize model complexity

As a final thought, this notion of simplicity shows up in fields beyond just
programming. It is derived from practices in mathematical logic, but a similar
idea shows up in statistics.

Another way of thinking about simplicity in functional programming is as _the
act of minimizing total description complexity._ In statistical practice, the
"description" is the sum of the model and the error: we choose the error
minimizing model, but favor some error over having too complex a model.

When a statistical model becomes too complex for the data it's been trained on
it becomes [_overfit_](https://en.wikipedia.org/wiki/Overfitting) or
[_non-identifiable_](https://en.wikipedia.org/wiki/Identifiability). In each
case, the performance of the model may appear solid at first, but fails under
scrutiny. An overfitted model is preoccupied with coincidences in the training
data and will perform poorly in new circumstances. A non-identifiable model may
also perform poorly on new data while additionally behaving erratically during
training.

(This is where the name "Well Conditioned" comes from: it refers to an
identifiability property of some statistical models.)

The solution in each case is reduction of the complexity of models considered.
This of course leads to a loss in explanatory richness, but without the data
(and thus expense of sampling, time taken to observe) that richness becomes a
liability.

---
title: "What is FP: Overview"
lang: en-US
meta:
  - name: description
    content: What is Functional Programming is a series of articles that attempts to get to the bottom of what functional programming really is. Oftentimes, FP is defined in technical terms as a property of a program (or even a language), but that's not very satisfying. This series explores FP as a series of values and their consequences in language design and programming practice.
  - name: keywords
    content: functional programming, fp, principles, values, defintion, haskell, scala, ocaml, sml, erlang, racket, scheme, lisp, clojure, swift, types, practices, best practices
---

# What is Functional Programming?

This series of articles attempts to answer "what is functional programming?" in a new way. 

Often, answers to this question involve an analysis of technique or technology, a description of "what makes a program functional" or language. We find that sort of description very unsatisfying. 

- Functional programming is not a binary thing: no single decision will suddenly make your work functional. It is something that arises out of consistent practice. It can be aided by things like type systems and "pure" programming, but if you adopt these technologies you still need to learn how to work with them instead of against.

- Describing a programming practice by particular techniques narrows your view. It treats FP as yet another software engineering fashion as opposed to a body of research and practice that began over a century ago.

- Most critically, discussing only FP practice ignores the fact that it is a point of view. Even if you use no FP techniques, being able to see the world from the functional point of view can benefit the way you write and reason about code.

It's our belief that FP arises from something deeper: a set of values and principles that lead inevitably to modern practices. Learning these values and principles will help you recognize functional practice in all kinds of situations.

## Articles

- [Simplicity](./simplicity/) discusses the key goal that functional programming tries to achieve, though it might not be quite what you think it is at first.
- [Creation and Analysis](./creation-and-analysis/) discusses a fundamental tradeoff in programming between expressiveness and analyzability. This tradeoff is often poorly balanced because you usually pay first for low expressiveness and only suffer poor analyzability in the longer run.
- [The Value of Values](./the-value-of-values/) introduces a key conceptual model of functional programming, the notion of a _value_ and demonstrates how this idea supports functional values.
- [Theory Over Analogy](./theory-over-analogy/) decries conventional ways of thinking about programming via metaphor. Metaphor is convenient, but insufficient for building intuition for programming. Moving instead to theories eliminates the notion of the "leaky abstraction" and allows us to build on firm foundations.

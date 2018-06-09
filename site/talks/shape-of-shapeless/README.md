---
title: The Shape of Shapeless
lang: en-US
meta:
  - name: description
    content: Shapeless is a Scala library for compile-time generics using type-level programming. Most first encounter it as magical and a little offputting due to its tempermental nature and opaque error messages. This talk aims to demystify Shapeless by teaching you its core principles and helping you to get a sense for the shape of Shapeless. First given at LambdaConf 2018.
  - name: keywords
    content: lambdaconf, 2018, shapeless, scala, generic programming, typelevel, generics, hlist, hlists, circe, boulder, colorado, dependent types, path dependent types, aux, aux pattern
---

# The Shape of Shapeless 

_I first gave this talk at [LambdaConf 2018 in Boulder, Colorado](http://lambdaconf.us/) as a 2-hour workshop. My goal was to help intermediate and advanced Scala programmers who had encountered Shapeless in their work to understand it better and feel comfortable not only using it, but even re-implementing it themselves._

## Abstract

[Shapeless](https://github.com/milessabin/shapeless) is a Scala library for compile-time generics using type-level programming. Most first encounter it as magical and a little offputting due to its tempermental nature and opaque error messages. This talk aims to demystify Shapeless by teaching you its core principles and helping you to get a sense for the shape of Shapeless.

## Links

- [The slides for the talk](./the_shape_of_shapeless_slides.pdf) which can be useful for attendees or watchers who wish to follow along with the talk. Most likely, you'll be better off reading the book (below) if you aren't intending on following along.
- [A repo with code explored during the talk](https://github.com/tel/shapeOfShapeless), the various `Speak` implementations and a generic `Ordering` derivation that works for all conforming case classes.
- [A short booklet, recapitulating and expanding on the material of the talk](./the_shape_of_shapeless.pdf) that I wrote originally as notes for the talk but then polished up as I felt it'd be helpful for attendees afterward to revisit the material and dig in deeper.

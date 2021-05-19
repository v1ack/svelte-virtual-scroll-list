# svelte-virtual-scroll-list

Svelte implementation of vue library [vue-virtual-scroll-list](https://github.com/tangbc/vue-virtual-scroll-list)

Virtualized scrolling for big lists

Online demo: [Svelte repl](https://ru.svelte.dev/repl/eae82aab17b04420885851d58de50a2e?version=3.38.2)

## Todo

- [x] virtual scroll
- [x] dispatch scroll events
- [x] header footer slots
- [ ] jumps on add data to top
- [x] change position
- [x] examples
- [x] npm

# API

## Props

|prop|type|default|description|
|---|---|---|---|
|data|object[]|`null`|Source for list|
|key|string|`id`|Unique key for getting data from `data`|
|keeps|number|`30`|Count of rendered items|
|estimateSize|number|`estimateSize`|Estimate size of each item, needs for smooth scrollbar|
|isHorizontal|boolean|`false`|Scroll direction|
|pageMode|boolean|`false`|Let virtual list using global document to scroll through the list|
|start|number|`0`|scroll position start index
|offset|number|`0`|scroll position offset
|topThreshold|number|`0`|The threshold to emit `top` event, attention to multiple calls.
|bottomThreshold|number|`0`|The threshold to emit `bottom` event, attention to multiple calls.

## Methods

Access to methods by component binding
<details>
<summary>Binding example</summary>

```html

<script>
    let vs
</script>

<VirtualScroll bind:this={vs}></VirtualScroll>
<button on:click={vs.scrollToBottom}>To bottom</button>
```

</details>

|method|arguments|description|
|---|---|---|
|scrollToBottom|`none`|Scroll list to bottom|
|scrollToIndex|`index: number`|Set scroll position to a designated index|
|scrollToOffset|`offset: number`|Set scroll position to a designated offset|
|getSize|`id: typeof props.key`|Get the designated item size|
|getSizes|`none`|Get the total number of stored (rendered) items|
|getOffset|`none`|Get current scroll offset|
|getClientSize|`none`|Get wrapper element client viewport size (width or height)|
|getScrollSize|`none`|Get all scroll size (scrollHeight or scrollWidth)|
|updatePageModeFront|`none`|When using page mode and virtual list root element offsetTop or offsetLeft change, you need call this method manually|

## Events

|event|description|
|---|---|
|scroll|Scroll event|
|top|Top of the list reached|
|bottom|Bottom of the list reached|

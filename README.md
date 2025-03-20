# svelte-virtual-scroll-list

[![npm](https://img.shields.io/npm/v/@josesan9/svelte-virtual-scroll-list?style=for-the-badge)](https://npmjs.com/package/@josesan9/svelte-virtual-scroll-list/)

fork of same library by v1ack [svelte-virtual-scroll-list](https://github.com/v1ack/svelte-virtual-scroll-list)

Virtualized scrolling for big lists. For now this does not support bi-directionality (unlike v1ach's implementation)

# Getting started

`npm i josesan9/svelte-virtual-scroll-list -D`


## Usage

```html

<script>
    import VirtualScroll from "svelte-virtual-scroll-list"

    let items = [{id: 1, text: "one"}, ...]
</script>
<div class="vs">
    <VirtualScroll
            data={items}
            key="id"
            let:data
    >
        <div slot="header">
            This is a header set via slot
        </div>
        <div>
            {data.text}
        </div>
        <div slot="footer">
            This is a footer set via slot
        </div>
    </VirtualScroll>
</div>
```

More examples available in `example` folder

# Comparing to other virtualizing components

|                           | svelte-virtual-scroll-list | svelte-virtual-list | svelte-tiny-virtual-list         |
|---------------------------|----------------------------|---------------------|----------------------------------|
| handle dynamic size data  | +                          | +                   | -                                |
| scroll methods (to index) | +                          | -                   | +                                |
| infinity scrolling        | +                          | -                   | one-directional with another lib |
| initial scroll position   | +                          | -                   | +                                |
| sticky items              | -                          | -                   | +                                |
| top/bottom slots          | +                          | -                   | +                                |
| reached top/bottom events | +                          | -                   | -                                |
| document as a list        | +                          | -                   | -                                |

# API

## Props

| prop            | type     | default        | description                                                        |
|-----------------|----------|----------------|--------------------------------------------------------------------|
| data            | object[] | `null`         | Source for list                                                    |
| key             | string   | `id`           | Unique key for getting data from `data`                            |
| keeps           | number   | `30`           | Count of rendered items                                            |
| estimateSize    | number   | `estimateSize` | Estimate size of each item, needs for smooth scrollbar             |
| isHorizontal    | boolean  | `false`        | Scroll direction                                                   |
| pageMode        | boolean  | `false`        | Let virtual list using global document to scroll through the list  |
| start           | number   | `0`            | scroll position start index                                        |
| offset          | number   | `0`            | scroll position offset                                             |
| topThreshold    | number   | `0`            | The threshold to emit `top` event, attention to multiple calls.    |
| bottomThreshold | number   | `0`            | The threshold to emit `bottom` event, attention to multiple calls. |

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

| method              | arguments              | description                                                                                                           |
|---------------------|------------------------|-----------------------------------------------------------------------------------------------------------------------|
| scrollToBottom      | `none`                 | Scroll list to bottom                                                                                                 |
| scrollToIndex       | `index: number`        | Set scroll position to a designated index                                                                             |
| scrollToOffset      | `offset: number`       | Set scroll position to a designated offset                                                                            |
| getSize             | `id: typeof props.key` | Get the designated item size                                                                                          |
| getSizes            | `none`                 | Get the total number of stored (rendered) items                                                                       |
| getOffset           | `none`                 | Get current scroll offset                                                                                             |
| getClientSize       | `none`                 | Get wrapper element client viewport size (width or height)                                                            |
| getScrollSize       | `none`                 | Get all scroll size (scrollHeight or scrollWidth)                                                                     |
| updatePageModeFront | `none`                 | When using page mode and virtual list root element offsetTop or offsetLeft change, you need call this method manually |

## Events

| event  | description                |
|--------|----------------------------|
| scroll | Scroll event               |
| top    | Top of the list reached    |
| bottom | Bottom of the list reached |

## Additional

### Params passed down to each virtual list item

| param      | description                                          |
|------------|------------------------------------------------------|
| data       | data item                                            |
| index      | index of item (in relation to full list)             |
| localIndex | index of item (in relation to rendered items only)   |

```html

<VirtualScroll
        data={items}
        key="id"
        let:data
        let:index
        let:localIndex
>
    <div>
        {data.text} {index}
    </div>
</VirtualScroll>
```
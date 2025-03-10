<script lang="ts" generics="T">
    import Virtual, {isBrowser} from "./virtual.js"
    import Item from "./Item.svelte"
    import {createEventDispatcher, onDestroy, onMount} from "svelte"

    /**
     * Unique key for getting data from `data`
     * @type {string}
     */
    export let key: keyof T = <keyof T>"id"
    /**
     * Source for list
     * @type {Array<any>}
     */
    export let data: T[]
    /**
     * Count of rendered items
     * @type {number}
     */
    export let keeps = 30
    /**
     * Estimate size of each item, needs for smooth scrollbar
     * @type {number}
     */
    export let estimateSize = 50
    /**
     * Scroll direction
     * @type {boolean}
     */
    export let isHorizontal = false
    /**
     * scroll position start index
     */
    export let start = 0
    /**
     * scroll position offset
     */
    export let offset = 0
    /**
     * Let virtual list using global document to scroll through the list
     * @type {boolean}
     */
    export let pageMode = false
    /**
     * The threshold to emit `top` event, attention to multiple calls.
     * @type {number}
     */
    export let topThreshold = 0
    /**
     * The threshold to emit `bottom` event, attention to multiple calls.
     * @type {number}
     */
    export let bottomThreshold = 0

    let displayItems: T[] = []
    let paddingStyle: string
    let directionKey = isHorizontal ? "scrollLeft" as const : "scrollTop" as const
    let range = null
    let virtual = new Virtual({
        slotHeaderSize: 0,
        slotFooterSize: 0,
        keeps: keeps,
        estimateSize: estimateSize,
        buffer: Math.round(keeps / 3), // recommend for a third of keeps
        uniqueIds: getUniqueIdFromDataSources(),
    }, onRangeChanged)
    let root: HTMLDivElement
    let shepherd: HTMLDivElement
    const dispatch = createEventDispatcher()

    /**
     * @type {(id: number) => number}
     */
    export function getSize(id: any) {
        return virtual.sizes.get(id)
    }

    /**
     * Count of items
     * @type {() => number}
     */
    export function getSizes() {
        return virtual.sizes.size
    }

    /**
     * @type {() => number}
     */
    export function getOffset() {
        if (pageMode && isBrowser()) {
            return document.documentElement[directionKey] || document.body[directionKey]
        } else {
            return root ? Math.ceil(root[directionKey]) : 0
        }
    }

    /**
     * @type {() => number}
     */
    export function getClientSize() {
        const key = isHorizontal ? "clientWidth" : "clientHeight"
        if (pageMode && isBrowser()) {
            return document.documentElement[key] || document.body[key]
        } else {
            return root ? Math.ceil(root[key]) : 0
        }
    }

    /**
     * @type {() => number}
     */
    export function getScrollSize() {
        const key = isHorizontal ? "scrollWidth" : "scrollHeight"
        if (pageMode && isBrowser()) {
            return document.documentElement[key] || document.body[key]
        } else {
            return root ? Math.ceil(root[key]) : 0
        }
    }

    /**
     * @type {() => void}
     */
    export function updatePageModeFront() {
        if (root && isBrowser()) {
            const rect = root.getBoundingClientRect()
            const {defaultView} = root.ownerDocument
            const offsetFront = isHorizontal ? (rect.left + defaultView!.pageXOffset) : (rect.top + defaultView!.pageYOffset)
            virtual.updateParam("slotHeaderSize", offsetFront)
        }
    }

    /**
     * @type {(offset: number) => void}
     */
    export function scrollToOffset(offset: number) {
        if (!isBrowser()) return
        if (pageMode) {
            document.body[directionKey] = offset
            document.documentElement[directionKey] = offset
        } else if (root) {
            root[directionKey] = offset
        }
    }

    /**
     * @type {(index: number) => void}
     */
    export function scrollToIndex(index: number) {
        if (index >= data.length - 1) {
            scrollToBottom()
        } else {
            const offset = virtual.getOffset(index)
            scrollToOffset(offset)
        }
    }

    /**
     * @type {() => void}
     */
    export function scrollToBottom() {
        if (shepherd) {
            const offset = shepherd[isHorizontal ? "offsetLeft" : "offsetTop"]
            scrollToOffset(offset)

            // check if it's really scrolled to the bottom
            // maybe list doesn't render and calculate to last range,
            // so we need retry in next event loop until it really at bottom
            setTimeout(() => {
                if (getOffset() + getClientSize() + 1 < getScrollSize()) {
                    scrollToBottom()
                }
            }, 3)
        }
    }

    onMount(() => {
        if (start) {
            scrollToIndex(start)
        } else if (offset) {
            scrollToOffset(offset)
        }

        if (pageMode) {
            updatePageModeFront()

            document.addEventListener("scroll", onScroll, {
                passive: false,
            })
        }
    })

    onDestroy(() => {
        virtual.destroy()
        if (pageMode && isBrowser()) {
            document.removeEventListener("scroll", onScroll)
        }
    })

    function getUniqueIdFromDataSources() {
        return data.map((dataSource) => dataSource[key])
    }

    function onItemResized(event: CustomEvent<any>) {
        const {id, size, type} = event.detail
        if (type === "item")
            virtual.saveSize(id, size)
        else if (type === "slot") {
            if (id === "header")
                virtual.updateParam("slotHeaderSize", size)
            else if (id === "footer")
                virtual.updateParam("slotFooterSize", size)

            // virtual.handleSlotSizeChange()
        }
    }

    function onRangeChanged(range_: any) {
        range = range_
        paddingStyle = paddingStyle = isHorizontal ? `0px ${range.padBehind}px 0px ${range.padFront}px` : `${range.padFront}px 0px ${range.padBehind}px`
        displayItems = data.slice(range.start, range.end + 1)
    }

    function onScroll(event: Event) {
        const offset = getOffset()
        const clientSize = getClientSize()
        const scrollSize = getScrollSize()

        // iOS scroll-spring-back behavior will make direction mistake
        if (offset < 0 || (offset + clientSize > scrollSize) || !scrollSize) {
            return
        }

        virtual.handleScroll(offset)
        emitEvent(offset, clientSize, scrollSize, event)
    }

    function emitEvent(offset: number, clientSize: number, scrollSize: number, event: Event) {
        dispatch("scroll", {event, range: virtual.getRange()})

        if (virtual.isFront() && !!data.length && (offset - topThreshold <= 0)) {
            dispatch("top")
        } else if (virtual.isBehind() && (offset + clientSize + bottomThreshold >= scrollSize)) {
            dispatch("bottom")
        }
    }

    $: scrollToOffset(offset)
    $: scrollToIndex(start)
    $: handleKeepsChange(keeps)

    function handleKeepsChange(keeps: number) {
        virtual.updateParam("keeps", keeps)
        virtual.handleSlotSizeChange()
    }

    $: handleDataSourcesChange(data)

    async function handleDataSourcesChange(data: T[]) {
        virtual.updateParam("uniqueIds", getUniqueIdFromDataSources())
        virtual.handleDataSourcesChange()
    }
</script>

<div bind:this={root} on:scroll={onScroll} style="overflow-y: auto; height: inherit" class="virtual-scroll-root">
    {#if $$slots.header}
        <Item on:resize={onItemResized} type="slot" uniqueKey="header">
            <slot name="header"/>
        </Item>
    {/if}
    <div style="padding: {paddingStyle}" class="virtual-scroll-wrapper">
        {#each displayItems as dataItem, dataIndex (dataItem[key])}
            <Item
                    on:resize={onItemResized}
                    uniqueKey={dataItem[key]}
                    horizontal={isHorizontal}
                    type="item">
                <slot data={dataItem} index={dataIndex} />
            </Item>
        {/each}
    </div>
    {#if $$slots.footer}
        <Item on:resize={onItemResized} type="slot" uniqueKey="footer">
            <slot name="footer"/>
        </Item>
    {/if}
    <div bind:this={shepherd} class="shepherd"
         style="width: {isHorizontal ? '0px' : '100%'};height: {isHorizontal ? '100%' : '0px'}"></div>
</div>

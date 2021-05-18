<script>
    import Virtual from "./vue/virtual"
    import Item from "./Item.svelte"
    import {onDestroy, onMount} from "svelte"

    export let dataKey
    export let dataSources
    export let keeps = 30
    export let estimateSize = 50
    export let direction = "vertical"
    export let offset = 0
    export let pageMode = false

    let displayItems = []
    let paddingStyle
    let isHorizontal = direction === "horizontal"
    let directionKey = isHorizontal ? "scrollLeft" : "scrollTop"
    let range = null
    let virtual = new Virtual({
        slotHeaderSize: 0,
        slotFooterSize: 0,
        keeps: keeps,
        estimateSize: estimateSize,
        buffer: Math.round(keeps / 3), // recommend for a third of keeps
        uniqueIds: getUniqueIdFromDataSources(),
    }, onRangeChanged)

    onMount(() => {
        if (pageMode) {
            updatePageModeFront()

            document.addEventListener("scroll", onScroll, {
                passive: false,
            })
        }
    })

    onDestroy(() => {
        virtual.destroy()
        if (pageMode) {
            document.removeEventListener("scroll", onScroll)
        }
    })

    let root

    function getUniqueIdFromDataSources() {
        return dataSources.map((dataSource) => dataSource[dataKey])
    }

    function onItemResized({id, size}) {
        virtual.saveSize(id, size)
    }

    function onRangeChanged(range_) {
        range = range_
        paddingStyle = paddingStyle = isHorizontal ? `0px ${range.padBehind}px 0px ${range.padFront}px` : `${range.padFront}px 0px ${range.padBehind}px`
        displayItems = dataSources.slice(range.start, range.end + 1)
    }

    function onScroll(evt) {
        const offset = getOffset()
        const clientSize = getClientSize()
        const scrollSize = getScrollSize()

        // iOS scroll-spring-back behavior will make direction mistake
        if (offset < 0 || (offset + clientSize > scrollSize + 1) || !scrollSize) {
            return
        }

        virtual.handleScroll(offset)
    }

    function getOffset() {
        if (pageMode) {
            return document.documentElement[directionKey] || document.body[directionKey]
        } else {
            return root ? Math.ceil(root[directionKey]) : 0
        }
    }

    function getClientSize() {
        const key = isHorizontal ? "clientWidth" : "clientHeight"
        if (pageMode) {
            return document.documentElement[key] || document.body[key]
        } else {
            return root ? Math.ceil(root[key]) : 0
        }
    }

    function getScrollSize() {
        const key = isHorizontal ? "scrollWidth" : "scrollHeight"
        if (pageMode) {
            return document.documentElement[key] || document.body[key]
        } else {
            return root ? Math.ceil(root[key]) : 0
        }
    }

    function updatePageModeFront() {
        if (root) {
            const rect = root.getBoundingClientRect()
            const {defaultView} = root.ownerDocument
            const offsetFront = isHorizontal ? (rect.left + defaultView.pageXOffset) : (rect.top + defaultView.pageYOffset)
            virtual.updateParam("slotHeaderSize", offsetFront)
        }
    }
</script>

<div bind:this={root} on:scroll={onScroll} style="overflow-y: auto; height: inherit">
    <div style="padding: {paddingStyle}">
        {#each displayItems as data}
            <Item on:resize={(e) => onItemResized(e.detail)} {...data}/>
        {/each}
    </div>
</div>

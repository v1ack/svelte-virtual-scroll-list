<script>
    import {afterUpdate, createEventDispatcher, onDestroy, onMount} from "svelte"

    export let horizontal = false
    export let uniqueKey
    export let type = "item"

    let resizeObserver
    let itemDiv

    const dispatch = createEventDispatcher()
    const shapeKey = horizontal ? "offsetWidth" : "offsetHeight"

    onMount(() => {
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(dispatchSizeChange)
            resizeObserver.observe(itemDiv)
        }
    })
    afterUpdate(dispatchSizeChange)
    onDestroy(() => {
        if (resizeObserver) {
            resizeObserver.disconnect()
            resizeObserver = null
        }
    })

    function dispatchSizeChange() {
        dispatch("resize", {id: uniqueKey, size: itemDiv ? itemDiv[shapeKey] : 0, type})
    }
</script>

<div bind:this={itemDiv} class="virtual-scroll-item">
    <slot/>
</div>

<script>
    import {afterUpdate, createEventDispatcher, onDestroy, onMount} from "svelte"

    export let horizontal = false
    export let uniqueKey

    let resizeObserver
    let itemDiv

    const dispatch = createEventDispatcher()
    const shapeKey = horizontal ? "offsetWidth" : "offsetHeight"

    onMount(() => {
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(() => {
                dispatchSizeChange()
            })
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

    function getCurrentSize() {
        return itemDiv ? itemDiv[shapeKey] : 0
    }

    // tell parent current size identify by unqiue key
    function dispatchSizeChange() {
        dispatch("resize", {id: uniqueKey, size: getCurrentSize()})
    }
</script>

<div bind:this={itemDiv}>
    <slot/>
</div>

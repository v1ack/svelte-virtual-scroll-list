<script>
    import VirtualScroll from "../src/VirtualScroll.svelte"
    import {createSequenceGenerator, randomInteger} from "./mock"
    import TestItem from "./TestItem.svelte"

    const getItemId = createSequenceGenerator()

    let items = []
    addItems(true, 1000)

    let list

    function addItems(top = true, count = 10) {
        let new_items = []
        for (let i = 0; i < count; i++)
            new_items.push({uniqueKey: getItemId(), height: randomInteger(20, 60)})
        if (top)
            items = [...new_items, ...items]
        else
            items = [...items, ...new_items]
    }
</script>
<div class="overflow-buttons">
    <button on:click={() => list.scrollToOffset(0)}>To top</button>
    <button on:click={list.scrollToBottom}>To bottom</button>
</div>
<div class="vs">
    <VirtualScroll
            bind:this={list}
            data={items}
            key="uniqueKey"
            let:data
            pageMode={true}
    >
        <div slot="header">
            This is a header
        </div>
        <TestItem {...data}/>
        <div slot="footer">
            This is a footer
        </div>
    </VirtualScroll>
</div>
<div>end</div>
<style>
    .overflow-buttons {
        z-index: 2;
        top: 10px;
        position: sticky;
    }
</style>

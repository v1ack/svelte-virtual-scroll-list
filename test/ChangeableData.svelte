<script>
    import {tick} from "svelte"
    import VirtualScroll from "../src/VirtualScroll.svelte"
    import {createSequenceGenerator, randomInteger, randomString} from "./mock"
    import TestItem from "./TestItem.svelte"

    const getItemId = createSequenceGenerator()

    let items = []
    addItems(true, 100)

    let list

    function addItems(top = true, count = 10) {
        let new_items = []
        for (let i = 0; i < count; i++)
            new_items.push({uniqueKey: getItemId(), text: randomString(3, 200), height: randomInteger(20, 60)})
        if (top)
            items = [...new_items, ...items]
        else
            items = [...items, ...new_items]
    }
</script>
<div class="vs">
    <VirtualScroll
            bind:this={list}
            data={items}
            key="uniqueKey"
            let:data
    >
        <div slot="header">
            This is a header
        </div>
        <TestItem {data}/>
        <div slot="footer">
            This is a footer
        </div>
    </VirtualScroll>
</div>
<button on:click={addItems}>Add 10 to top</button>
<button on:click={() => addItems(false)}>Add 10 to bottom</button>
<button on:click={list.scrollToBottom}>To bottom</button>
<button on:click={async () => {
        addItems(false, 1)
        await tick()
        list.scrollToBottom()
    }}>Add 1 and scroll to bottom
</button>
<button on:click={()=>items[15].height = randomInteger(10, 150)}>Random height for 15 item</button>


<style>
    .vs {
        height: 300px;
    }
</style>

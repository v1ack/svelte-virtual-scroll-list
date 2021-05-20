<script>
    import {tick} from "svelte"
    import VirtualScroll from "../src/VirtualScroll.svelte"
    import {asyncTimeout, createSequenceGenerator, randomInteger} from "./mock"
    import TestItem from "./TestItem.svelte"

    const getItemId = createSequenceGenerator()

    let items = []
    addItems(false, 70)

    let list

    function addItems(top = true, count = 10) {
        let new_items = []
        for (let i = 0; i < count; i++)
            new_items.push({uniqueKey: getItemId(), height: randomInteger(20, 60)})
        if (top) {
            items = [...new_items, ...items]

            tick().then(() => {
                const sids = new_items.map(i => i.uniqueKey)
                const offset = sids.reduce((previousValue, currentSid) => previousValue + list.getSize(currentSid), 0)
                list.scrollToOffset(offset)
            })
        } else
            items = [...items, ...new_items]
    }

    async function asyncAddItems(top = true, count = 10) {
        await asyncTimeout(1000)
        addItems(top, count)
    }
</script>

<div class="vs">
    <VirtualScroll
            bind:this={list}
            data={items}
            key="uniqueKey"
            let:data
            on:bottom={() => asyncAddItems(false)}
            on:top={() => asyncAddItems()}
            start={30}
    >
        <div slot="header">
            Loading...
        </div>
        <TestItem {...data}/>
        <div slot="footer">
            loading...
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

<style>
    .vs {
        height: 300px;
    }
</style>

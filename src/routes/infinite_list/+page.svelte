<script>
    import {tick} from "svelte"
    import {VirtualScroll} from "$lib"
    import {asyncTimeout, createSequenceGenerator, randomInteger} from "../mock"
    import TestItem from "../TestItem.svelte"

    const getItemId = createSequenceGenerator()

    let loading = false
    let items = itemsFactory(70)

    let list

    function itemsFactory(count = 10) {
        let new_items = []
        for (let i = 0; i < count; i++)
            new_items.push({uniqueKey: getItemId(), height: randomInteger(20, 60)})
        return new_items
    }

    async function asyncAddItems(top = true, count = 10) {
        if (loading) return
        loading = true
        await asyncTimeout(1000)

        let new_items = itemsFactory(count)

        if (top) {
            items = [...new_items, ...items]

            // to save position on adding items to top we need to calculate
            // new top offset based on added items
            //
            // it works ONLY if newly added items was rendered
            tick().then(() => {
                const sids = new_items.map(i => i.uniqueKey)
                const offset = sids.reduce((previousValue, currentSid) => previousValue + list.getSize(currentSid), 0)
                list.scrollToOffset(offset)
            })
        } else {
            items = [...items, ...new_items]

            // timeout needs because sometimes when you scroll down `scroll` event fires twice
            // and changes list.virtual.direction from BEHIND to FRONT
            // maybe there is a better solution
            setTimeout(() => list.scrollToOffset(list.getOffset() + 1), 3)
        }
        loading = false
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
<button on:click={() => list.scrollToOffset(0)}>To Top</button>
<button on:click={list.scrollToBottom}>To bottom</button>

<style>
    .vs {
        height: 300px;
    }
</style>

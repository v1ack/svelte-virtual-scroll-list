<script>
    import {tick} from "svelte"
    import {flip} from "svelte/animate"
    import {writable} from "svelte/store"
    import VirtualScroll from "../src/VirtualScroll.svelte"
    import {createSequenceGenerator, randomInteger} from "./mock"
    import TestItem from "./TestItem.svelte"

    const getItemId = createSequenceGenerator()
    const getNotificationId = createSequenceGenerator()

    let items = writable([])
    addItems(true, 1000)

    let list
    let notifications = {}

    function addItems(top = true, count = 10) {
        let new_items = []
        for (let i = 0; i < count; i++)
            new_items.push({uniqueKey: getItemId(), height: randomInteger(20, 60)})
        if (top)
            $items = [...new_items, ...$items]
        else
            $items = [...$items, ...new_items]
    }

    function addNotification(e) {
        const id = getNotificationId()
        notifications[id] = e
        setTimeout(() => {
            delete notifications[id]
            notifications = notifications
        }, 5000)
    }
</script>
<div class="vs">
    <VirtualScroll
            bind:this={list}
            data={$items}
            key="uniqueKey"
            let:data
            on:bottom={() => addNotification("bottom")}
            on:top={() => addNotification("top")}
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
<button on:click={addItems}>Add 10 to top</button>
<button on:click={() => addItems(false)}>Add 10 to bottom</button>
<button on:click={list.scrollToBottom}>To bottom</button>
<button on:click={async () => {
        addItems(false, 1)
        await tick()
        list.scrollToBottom()
    }}>Add 1 and scroll to bottom
</button>
<div>
    {#each Object.entries(notifications) as [id, action] (id)}
        <div animate:flip>{action} </div>
    {/each}
</div>


<style>
    .vs {
        height: 300px;
    }
</style>

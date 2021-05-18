<script>
    import VirtualScroll from "../src/VirtualScroll.svelte"
    import {getID, randomInteger, randomString} from "./mock"
    import {tick} from "svelte"
    import TestItem from "./TestItem.svelte"

    let items = []
    addItems(true, 1000)

    let list
    let notifications = {}

    function addItems(top = true, count = 10) {
        let new_items = []
        for (let i = 0; i < count; i++)
            new_items.push({uniqueKey: getID(), text: randomString(3, 200), height: randomInteger(20, 60)})
        if (top)
            items.unshift(...new_items)
        else items.push(...new_items)
        items = items
    }

    function addNotification(e) {
        const id = getID()
        notifications[id] = e
        setTimeout(() => {
            delete notifications[id]
            notifications = notifications
        }, 5000)
    }
</script>

<main>
    <VirtualScroll
            bind:this={list}
            dataKey="uniqueKey"
            dataSources={items}
            let:data
            on:tobottom={()=>addNotification("bottom")}
            on:totop={()=>addNotification("top")}
    >
        <TestItem {data}/>
    </VirtualScroll>
    <button on:click={() => addItems()}>Add 10 to top</button>
    <button on:click={() => addItems(false)}>Add 10 to bottom</button>
    <button on:click={() => list.scrollToBottom()}>To bottom</button>
    <button on:click={async () => {
        addItems(false, 1)
        await tick()
        list.scrollToBottom()
    }}>Add 1 and scroll to bottom
    </button>
    {#each Object.values(notifications) as notification}
        <p>{notification}</p>
    {/each}
</main>

<style>
    main {
        padding: 1em;
        margin: 0 auto;
        width: 900px;
        height: 300px;
    }
</style>

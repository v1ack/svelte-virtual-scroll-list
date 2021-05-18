<script>
    import VirtualScroll from "../src/VirtualScroll.svelte"
    import {getID, randomInteger, randomString} from "./mock"

    let items = []
    addItems(true, 1000)

    let list

    function addItems(top = true, count = 10) {
        let new_items = []
        for (let i = 0; i < count; i++)
            new_items.push({uniqueKey: getID(), text: randomString(3, 200), height: randomInteger(20, 60)})
        if (top)
            items.unshift(...new_items)
        else items.push(...new_items)
        items = items
    }
</script>

<main>
    <VirtualScroll
            bind:this={list}
            dataKey="uniqueKey"
            dataSources={items}
    >
    </VirtualScroll>
</main>

<style>
    main {
        padding: 1em;
        margin: 0 auto;
        width: 900px;
        height: 300px;
    }
</style>

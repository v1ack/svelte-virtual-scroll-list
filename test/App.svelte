<script>
    import SimpleList from "./SimpleList.svelte"
    import SimpleListStore from "./SimpleListStore.svelte"
    import InfiniteList from "./InfiniteList.svelte"
    import PageList from "./PageList.svelte"
    import ChangeableData from "./ChangeableData.svelte"

    const pages = [
        {name: "Simple list", component: SimpleList},
        {name: "Infinite list", component: InfiniteList},
        {name: "Page mode", component: PageList},
        {name: "ChangeableData", component: ChangeableData},
        {name: "SimpleListStore", component: SimpleListStore},
    ]

    let currentPage = pages[0]
</script>

<main>
    <h1>svelte-virtual-scroll-list example</h1>
    <div class="page-selector-container">
        {#each pages as page}
        <span
                class="page-selector"
                on:click={() => currentPage = page}
                class:active={currentPage.name === page.name}
        >{page.name}</span>
        {/each}
    </div>
    <svelte:component this={currentPage.component}/>
</main>

<style>
    main {
        padding: 1em;
        margin: 0 auto;
        max-width: 900px;
    }

    .page-selector-container {
        margin-bottom: 20px;
    }

    .page-selector {
        margin-right: 10px;
        text-decoration: underline;
        cursor: pointer;
        color: blue;
    }

    .page-selector.active {
        font-weight: bold;
    }
</style>

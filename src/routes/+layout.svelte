<script>
    import {page} from "$app/stores"
    import "../app.css"


    const pages = [
        {name: "Simple list", component: "simple_list"},
        {name: "Simple list horizontal", component: "simple_list_horizontal"},
        {name: "Infinite list", component: "infinite_list"},
        {name: "Page mode", component: "page_list"},
        {name: "ChangeableData", component: "changable_data"},
        {name: "SimpleListStore", component: "list_store"},
    ]
    let current_path = ""
    function get_path(page) {
        const route_parts = page.route.id.split("/")
        return route_parts[route_parts.length - 1]
    }
    $: current_path = get_path($page)

</script>

<svelte:head>
    <title>svelte-virtual-scroll-list example</title>
</svelte:head>

<main>
    <h1>svelte-virtual-scroll-list example
    </h1>
    <div class="page-selector-container">
        {#each pages as page}
        <a
                href={page.component}
                class="page-selector"
                class:active={current_path === page.component}
        >{page.name}</a>
        {/each}
        <a class="source" href="https://github.com/josesan9/svelte-virtual-scroll-list/tree/master/src/routes/{current_path}">Source</a>
    </div>
    <slot></slot>
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
        cursor: pointer;
        color: blue;
    }

    .page-selector:hover {
        text-decoration: underline;
    }

    .page-selector.active {
        font-weight: bold;
    }

    .source {
        float: right;
        color: blue;
    }
</style>

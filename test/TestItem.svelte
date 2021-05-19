<script>
    export let data
</script>

<div style="height: {data.height}px">
    {data.uniqueKey} Item ({data.height}px)
</div>

<style>
    div {
        border: 1px solid gray;
    }
</style>

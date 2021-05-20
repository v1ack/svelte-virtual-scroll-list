<script>
    export let uniqueKey
    export let height
</script>

<div style="height: {height}px">
    {uniqueKey} Item ({height}px)
</div>

<style>
    div {
        border: 1px solid gray;
    }
</style>

<script>
    export let uniqueKey
    export let height
</script>

<div style="height: {height}px">
    {uniqueKey} Item ({height}px)
</div>

<style>
    div {
        /* Don't set margin top and bottom together! It will break size counting */
        padding: 8px;
        color: black;
        background-color: #f6f6f6;
        border-radius: 20px;
    }
</style>

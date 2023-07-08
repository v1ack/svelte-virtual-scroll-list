<script>
    export let uniqueKey
    export let width
</script>

<div style="width: {width}px">
    {uniqueKey} Item ({width}px)
</div>

<style>
    div {
        /* Don't set margin top and bottom together! It will break size counting */
        padding: 8px;
        color: black;
        background-color: #f6f6f6;
        border-radius: 20px;
        height: 100%;
        box-sizing: border-box;
    }
</style>

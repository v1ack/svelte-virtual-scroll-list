type DataKey<T> = ((item: T, index: number) => any)
type EstimateSize<T> = ((item: T) => number)

interface IParam<T> {
    slotHeaderSize: number,
    slotFooterSize: number,
    overflow: number,
    data: T[],
}

interface IRange {
    start: number,
    end: number,
    padFront: number,
    padBehind: number,
}

export class Virtual<T>{
    param: IParam<T>
    callUpdate: (range: IRange) => void
    currOffset = 0
    clientHeight = 0
    range: IRange
    /** array of sizes for each container */
    sizes = new Map<any, number>()
    /** array of offsets for each container */
    offsets: number[]
    keyFn: DataKey<T>
    estimateSize: EstimateSize<T>

    constructor(param: IParam<T>, callUpdate: typeof this.callUpdate, keyFn: DataKey<T>, estimateSize: number | EstimateSize<T>) {
        // param data
        this.param = param
        this.callUpdate = callUpdate
        this.keyFn = keyFn
        this.estimateSize = estimateSize instanceof Function ? estimateSize : () => estimateSize

        // size data
        this.sizes = new Map()
        this.offsets = []
        this.param.data.forEach((d, i) => {
            let estimateSize = this.estimateSize instanceof Function ? this.estimateSize(d) : this.estimateSize
            this.sizes.set(this.keyFn instanceof Function ? this.keyFn(d, i) : d[this.keyFn], estimateSize)
        })
        this.rebuildOffsets()

        this.range = Object.create({ start: -1, end: -1, padFront: 0, padBehind: 0 })
    }

    // return current render range
    getRange() {
        return { ...this.range }
    }

    // return start index offset
    getOffset(start: number) {
        return (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize
    }
    
    updateParam<K extends keyof IParam<T>>(key: K, value: IParam<T>[K]) {
        if (this.param && (key in this.param)) {
            this.param[key] = value
            // if data change, find out deleted id and remove from size map
            if (key === "data") {
                let ids = (value as T[]).map(this.keyFn)
                this.sizes.forEach((v, key) => {
                    if (!ids.includes(key)) {
                        this.sizes.delete(key)
                    }
                })
                this.rebuildOffsets()
                this.handleScroll(this.currOffset, this.clientHeight, true)
            }
        }
    }

    // save each size map by id
    saveSize(id: any, size: number) {
        if (this.sizes.get(id) === size) {
            return
        }
        this.sizes.set(id, size)
        this.rebuildOffsets(this.param.data.findIndex((d, i) => this.keyFn(d, i) === id))
    }
    // calculating range on scroll
    handleScroll(offset: number, clientHeight: number, forceUpdate = false) {
        this.currOffset = offset
        this.clientHeight = clientHeight
        let startIndex = Math.max(this.offsets.findIndex(o => o >= offset) - 1 - this.param.overflow, 0)
        let endIndex = this.offsets.findIndex(o => o >= offset + clientHeight)
        if (endIndex === -1) {
            endIndex = this.param.data.length - 1
        } else if (endIndex < startIndex) {
            endIndex = startIndex
        }
        endIndex = Math.min(endIndex + this.param.overflow, this.param.data.length - 1)
        this.updateRange(startIndex, endIndex, forceUpdate)
    }

    // ----------- public method end -----------
    
    // rebuilds the offset array
    rebuildOffsets(startIndex?: number) {
        if (startIndex === undefined) {
            this.offsets = [0]
            startIndex = 0
        }
        if (startIndex === -1) return
        let lastOffset = this.offsets[startIndex] || 0
        for (let i = startIndex + 1; i < this.param.data.length; i++) {
            let id = this.keyFn(this.param.data[i - 1], i - 1)
            lastOffset += this.sizes.get(id)!
            if (Number.isNaN(lastOffset)) {
            }
            this.offsets[i] = lastOffset
        }
    }

    // return a scroll offset from given index, can efficiency be improved more here?
    // although the call frequency is very high, its only a superposition of numbers
    getIndexOffset(givenIndex: number) {
        if (!givenIndex) {
            return 0
        }

        return this.offsets[givenIndex] || 0
    }

    // setting to a new range and rerender
    updateRange(start: number, end: number, forceUpdate = false) {
        if (!forceUpdate && start === this.range.start && end === this.range.end) return;
        this.range.start = start
        this.range.end = end
        this.range.padFront = this.getPadFront()
        this.range.padBehind = this.getPadBehind()
        this.callUpdate(this.range)
    }

    // return total front offset
    getPadFront() {
        return this.offsets[this.range.start] || 0
    }

    // return total behind offset
    getPadBehind() {
        if (this.range.end >= this.param.data.length - 1) {
            return 0
        }
        return this.offsets[this.offsets.length - 1] + this.sizes.get(this.keyFn(this.param.data[this.param.data.length - 1], this.param.data.length - 1))! - (this.offsets[this.range.end + 1])
    }
}

export function isBrowser() {
    return typeof document !== "undefined"
}
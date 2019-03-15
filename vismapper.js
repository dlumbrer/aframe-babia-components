/* global AFRAME */
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

let MAX_SIZE_BAR = 10

/**
* A-Charts component for A-Frame.
*/
AFRAME.registerComponent('vismapper', {
    schema: {
        // Data
        dataToShow: { type: 'string' },
        // Geo
        width: { type: 'string' },
        depth: { type: 'string' },
        height: { type: 'string' },
        radius: { type: 'string' },
        // For charts
        x_axis: { type: 'string' }
    },

    /**
    * Set if component needs multiple instancing.
    */
    multiple: false,

    /**
    * Called once when component is attached. Generally for initial setup.
    */
    init: function () { },

    /**
    * Called when component is attached and when component data changes.
    * Generally modifies the entity based on the data.
    */

    update: function (oldData) {
        let data = this.data;
        let el = this.el;

        /**
         * Update geometry component
         */
        if (data.dataToShow && data.dataToShow != oldData.dataToShow) {
            let dataJSON = JSON.parse(data.dataToShow)
            if (el.components.geometry) {
                if (el.components.geometry.data.primitive === "box") {
                    el.setAttribute("geometry", "height", (dataJSON[data.height] / 100))
                    el.setAttribute("geometry", "width", dataJSON[data.width] || 2)
                    el.setAttribute("geometry", "depth", dataJSON[data.depth] || 2)
                    let oldPos = el.getAttribute("position")
                    el.setAttribute("position", { x: oldPos.x, y: dataJSON[data.height] / 200, z: oldPos.z })
                } else if (el.components.geometry.data.primitive === "sphere") {
                    el.setAttribute("geometry", "radius", (dataJSON[data.radius] / 10000) || 2)
                    let oldPos = el.getAttribute("position")
                    el.setAttribute("position", { x: oldPos.x, y: dataJSON[data.height], z: oldPos.z })
                }
            } else if (el.components.simplebarchart) {
                let list = generate2Dlist(data, dataJSON)
                el.setAttribute("simplebarchart", "data", JSON.stringify(list))
            }
        }
    },
    /**
    * Called when a component is removed (e.g., via removeAttribute).
    * Generally undoes all modifications to the entity.
    */
    remove: function () { },

    /**
    * Called on each scene tick.
    */
    // tick: function (t) { },

    /**
    * Called when entity pauses.
    * Use to stop or remove any dynamic or background behavior such as events.
    */
    pause: function () { },

    /**
    * Called when entity resumes.
    * Use to continue or add any dynamic or background behavior such as events.
    */
    play: function () { },

})

let generate2Dlist = (data, dataToProcess) => {
    let list = []
    Object.values(dataToProcess).forEach(value => {
        let item = {
            "key": value[data.x_axis],
            "size": value[data.height]
        }
        list.push(item)
    });
    return list
}

function normalize(val, min, max) { return (val - min) / (max - min); }
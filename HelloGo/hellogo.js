(function () {
    let template = document.createElement("template");
    template.innerHTML = `
		<style>		
		:host #myDiagramDiv {
			width:400px;
			height:150px; 
			border: 1px solid black;

			}
		</style>

        <body onload="chart(shadowRoot)">
            <div id="myDiagramDiv"></div>
        </body>

	`;

    class Chart extends HTMLElement {
        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(template.content.cloneNode(true));
            this.addEventListener("click", event => {
                var event = new Event("onClick");
                this.dispatchEvent(event);
            });
            this._props = {};
            this.init(shadowRoot)
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            if ("color" in changedProperties) {
                this.style["background-color"] = changedProperties["color"];
            }
        }


        async init(shadowRoot) {
            for (let fileName of ["go-debug.js"]) {
                await load(fileName)
                //script.onload = function(){ customElements.define("com-demo-chart", Chart);}; 

            }
            console.log("library importiert")
            chart(shadowRoot);

        }
    }


    function load(fileName) {
        return new Promise(
            function (resolve, reject) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://unpkg.com/gojs/release/" + fileName;
                script.onload = resolve;
                script.onerror = reject
                document.head.appendChild(script);
                console.log(script);
            }
        )

    }


    function chart(shadowRoot) {
        console.log("code funktioniert");

        var $ = go.GraphObject.make;
        myDiagram = $(go.Diagram, "myDiagramDiv");
        var nodeDataArray = [
            { key: "Alpha", color: "lime" },
            { key: "Beta", color: "cyan" },

        ];
        var linkDataArray = [
            { to: "Beta", from: "Alpha", color: "red" }
        ];
        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
        myDiagram.nodeTemplate =
            $(go.Node, "Auto",
                $(go.Shape, "RoundedRectangle", { fill: "white" },
                    new go.Binding("fill", "color")
                ),
                $(go.TextBlock, "text",
                    new go.Binding("text", "key")
                )
            );


    }

    customElements.define("com-demo-hellogo", Chart);


})();
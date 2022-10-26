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

        <div id="myDiagramDiv"></div>

	`;

    class Chart extends HTMLElement {
        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(template.content.cloneNode(true));
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
            console.log("chart wird angezeigt")
            console.log(this.myDataBinding)
			console.log("Data Binding funktioniert")

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
        //var data = {Helen: ["Bewerbung", "Interview1", "Interview2","Angebot erhalten"]}
        var data = myDataBinding.data

       for(k in data){
           makeChart(data[k], shadowRoot)
       }

    }

    function makeChart(tableau, shadowRoot){
        var $ = go.GraphObject.make;
        myDiagram = $(go.Diagram, shadowRoot.querySelector("#myDiagramDiv"));

      
        var nodeDataArray = tableau.map(e=>({key:e}));
        var linkDataArray = tableau.reduce((acc,x,i,t)=>i==(t.length-1) ? acc : (acc.concat([{from: x, to:t[i+1]}])), []);
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
(function() { 
	let template = document.createElement("template");
	template.innerHTML = `
		<style>		
		:host #chartdiv {
			width: 100%;
			height: 500px;
			border-color: #92a8d1;
			border-style: solid;

			}
		</style>

		<div id="chartdiv"></div>

	`;

	class Chart extends HTMLElement {
		constructor() {
			super(); 
			let shadowRoot = this.attachShadow({mode: "open"});
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


		async init(shadowRoot){
			for(let fileName of ["go-debug.js"]){
				await load(fileName)
				//script.onload = function(){ customElements.define("com-demo-chart", Chart);}; 
		
			}
			console.log("library importiert")
			chart(shadowRoot);

		}
	}	


	function load(fileName){
	return new Promise(
		function(resolve,reject){
			var script = document.createElement("script"); 
			script.type = "text/javascript"; 
			script.src = "https://unpkg.com/gojs/release/"+fileName; 
			script.onload =  resolve; 
			script.onerror = reject
			document.head.appendChild(script);	
			console.log(script);
		}
	)
	
	}


	function chart(shadowRoot){
		console.log("code funktioniert");
		
	}

	customElements.define("com-demo-hellogo", Chart);

	
})();
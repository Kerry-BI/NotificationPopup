(function() { 
	const template = document.createElement('template')
	template.innerHTML = `
	
<body>
    <div class="notification-form">
        <h2>Notifications</h2>
        <div class="notification-list" id="notificationList">
            <!-- Notifications will be injected here by JavaScript -->
        </div>
    </div>
</body>

<style>
    body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.notification-form {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
}

.notification-form h2 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
    text-align: center;
}

.notification-list {
    max-height: 300px;
    overflow-y: auto;
}

.notification {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
}

.notification:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.notification-date {
    font-size: 14px;
    color: #888;
    margin-bottom: 5px;
}

.notification-message {
    font-size: 16px;
    color: #333;
    }
</style>
	`;

	//var items;
	var dragSrcEl = null;
	class NotificationMain extends HTMLElement {

		
		constructor() {
			super(); 
			this._shadowRoot = this.attachShadow({mode: 'open'});
			this._shadowRoot.appendChild(template.content.cloneNode(true));

	
			
			this.userID= "";
			this.dashboardName = "";
			this.dontShowAgain= "";
	
			

			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});

			this._props = {};
			} //end constructor 

			// Function to fetch the JSON file and check for the matching dashboardName and userID
			async checkDontShowAgain() {
				try {
				// Fetch the JSON file
					const response = await fetch('/dashboards.json');
				
					// Check if the response is ok
					if (!response.ok) {
						throw new Error("Error fetching the JSON file.");
					}else{
				
						// Parse the JSON data
						const data = await response.json();
					
						// Check if the dashboardName exists
						if (!data[dashboardName]) {
							console.error(`Error: Dashboard with name ${dashboardName} not found.`);
							return;
						}else{
					
							// Get the users list under the matching dashboardName
							const users = data[dashboardName];
						
							// Check if the currentUserID exists in the dashboard
							if (!users[currentUserID]) {
								console.error(`Error: User with ID ${currentUserID} not found in dashboard ${dashboardName}.`);
								return;
							}else{
								// If both the dashboard and user are found, get the dontShowAgain value
								const dontShowAgainVal = users[currentUserID].dontShowAgain;
								console.log(`dontShowAgain for user ${currentUserID} in dashboard ${dashboardName}:`, dontShowAgainVal);

								this.dontShowAgain = dontShowAgainVal
								//update value here 
							}
						}
					}
					
				} catch (error) {
					console.error("Error: could not load data file ", error);
				}
			}


			async updateDontShowAgain(value) {
				try {
				// Fetch the JSON file
					const response = await fetch('/dashboards.json');
				
					// Check if the response is ok
					if (!response.ok) {
						throw new Error("Error fetching the JSON file.");
					}else{
				  
						// Parse the JSON data
						const data = await response.json();
					
						// Check if the dashboardName exists
						if (!data[dashboardName]) {
							console.error(`Error: Dashboard with name ${dashboardName} not found.`);
							return;
						}else{
					
							//Get the users list under the matching dashboardName
							const users = data[dashboardName];
						
							// Check if the currentUserID exists in the dashboard
							if (!users[currentUserID]) {
								console.error(`Error: User with ID ${currentUserID} not found in dashboard ${dashboardName}.`);
								return;
							}else{
								// If both the dashboard and user are found, get the dontShowAgain value
								users[currentUserID].dontShowAgain = value;
								console.log(`dontShowAgain for user ${currentUserID} in dashboard ${dashboardName}:`, users[currentUserID].dontShowAgain );

								this.dontShowAgain = dontShowAgainVal
							}
						}
					}
					
				} catch (error) {
					console.error("Error: could not load data file ", error);
				}
			}



			onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
			}


			onCustomWidgetAfterUpdate(changedProperties) {
				if ("userID" in changedProperties) {
					//here call code to update the drill path 
					this.currentUser = changedProperties["userID"];

					if(this.dashboardName !==""){
						this.checkDontShowAgain();
					}

				}

				if ("dashboardName" in changedProperties) {
					//here call code to update the drill path 
					this.dashboardName = changedProperties["dashboardName"];

					if(this.currentUser !==""){
						this.checkDontShowAgain();
					}
				}

				if ("dontShowAgain" in changedProperties) {
					//here call code to update the drill path 
					this.dontShowAgain = changedProperties["dontShowAgain"];

					//
					if(this.dashboardName !=="" && this.currentUser !==""){
						this.updateDontShowAgain(this.dontShowAgain);
					}
				}
			}

			onCustomWidgetResize (width, height) {
				
			  }

	}

		customElements.define('notification-main', NotificationMain)
	  })()

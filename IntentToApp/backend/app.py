from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS so the separate frontend can communicate with this API
CORS(app)

# ---------------------------------------------------------
# UI CONFIGURATION SCHEMAS (Phase 2 - 20 Categories Database)
# ---------------------------------------------------------
UI_SCHEMAS = {
    # 1. Travel Planning
    "travel": {
        "title": "✈️ Travel Planning", "description": "Input dynamic constraints to generate a travel itinerary.",
        "components": [
            {"type": "input", "id": "destination", "label": "Destination"},
            {"type": "input", "id": "start_location", "label": "Start Location"},
            {"type": "date", "id": "dates", "label": "Dates"},
            {"type": "input", "id": "travelers", "label": "Travelers"},
            {"type": "input", "id": "budget", "label": "Budget ($)"},
            {"type": "select", "id": "transport", "label": "Transport Mode", "options": ["Flight", "Train", "Car", "Bus"]},
            {"type": "select", "id": "hotel", "label": "Hotel Type", "options": ["Luxury", "Budget", "Hostel"]},
            {"type": "button", "id": "submit", "label": "Generate Itinerary", "action": "submit"}
        ]
    },
    # 2. Finance Management
    "finance": {
        "title": "💰 Finance Management", "description": "Track incomes, budgets, and savings goals.",
        "components": [
            {"type": "input", "id": "income", "label": "Income"},
            {"type": "input", "id": "expenses", "label": "Expenses"},
            {"type": "select", "id": "categories", "label": "Categories", "options": ["Food", "Transport", "Rent", "Misc"]},
            {"type": "input", "id": "savings_goal", "label": "Savings Goal"},
            {"type": "input", "id": "budget_limit", "label": "Budget Limit"},
            {"type": "date", "id": "date_range", "label": "Date Range"},
            {"type": "button", "id": "submit", "label": "Submit Finances", "action": "submit"}
        ]
    },
    # 3. Healthcare / Medicine
    "healthcare": {
        "title": "🏥 Healthcare / Medicine", "description": "Log patient symptoms and doctor appointments.",
        "components": [
            {"type": "input", "id": "patient", "label": "Patient Name"},
            {"type": "input", "id": "age", "label": "Age"},
            {"type": "input", "id": "symptoms", "label": "Symptoms"},
            {"type": "input", "id": "diagnosis", "label": "Diagnosis"},
            {"type": "input", "id": "medicines", "label": "Medicines"},
            {"type": "date", "id": "appointment", "label": "Appointment Date"},
            {"type": "input", "id": "doctor", "label": "Doctor Name"},
            {"type": "button", "id": "submit", "label": "Log Medical Data", "action": "submit"}
        ]
    },
    # 4. Trading & Investments
    "trading": {
        "title": "📈 Trading & Investments", "description": "Manage your stock portfolio and risk level.",
        "components": [
            {"type": "input", "id": "stock_name", "label": "Stock Name"},
            {"type": "input", "id": "invest_amount", "label": "Investment Amount"},
            {"type": "select", "id": "risk_level", "label": "Risk Level", "options": ["Low", "Medium", "High"]},
            {"type": "input", "id": "time_period", "label": "Time Period"},
            {"type": "select", "id": "portfolio", "label": "Portfolio Type", "options": ["Growth", "Dividend", "Value"]},
            {"type": "button", "id": "submit", "label": "Record Trade", "action": "submit"}
        ]
    },
    # 5. Fitness & Health
    "fitness": {
        "title": "🏋️ Fitness & Health", "description": "Track health goals and daily workouts.",
        "components": [
            {"type": "input", "id": "weight", "label": "Weight"},
            {"type": "input", "id": "height", "label": "Height"},
            {"type": "input", "id": "goal", "label": "Goal"},
            {"type": "input", "id": "workout_type", "label": "Workout Type"},
            {"type": "input", "id": "calories", "label": "Calories Burned"},
            {"type": "input", "id": "duration", "label": "Duration (mins)"},
            {"type": "button", "id": "submit", "label": "Log Workout", "action": "submit"}
        ]
    },
    # 6. Cooking & Recipes
    "cooking": {
        "title": "🍳 Cooking & Recipes", "description": "Log dishes and dynamic recipes.",
        "components": [
            {"type": "input", "id": "dish_name", "label": "Dish Name"},
            {"type": "input", "id": "ingredients", "label": "Ingredients"},
            {"type": "input", "id": "quantity", "label": "Quantity"},
            {"type": "input", "id": "time", "label": "Cooking Time"},
            {"type": "input", "id": "cuisine", "label": "Cuisine Type"},
            {"type": "button", "id": "submit", "label": "Save Recipe", "action": "submit"}
        ]
    },
    # 7. Education / Learning
    "education": {
        "title": "🎓 Education / Learning", "description": "Plan your academic schedule and topics.",
        "components": [
            {"type": "input", "id": "subject", "label": "Subject"},
            {"type": "input", "id": "topics", "label": "Topics"},
            {"type": "input", "id": "study_hours", "label": "Study Hours"},
            {"type": "date", "id": "deadline", "label": "Deadline"},
            {"type": "select", "id": "priority", "label": "Priority", "options": ["High", "Medium", "Low"]},
            {"type": "input", "id": "resources", "label": "Resources"},
            {"type": "button", "id": "submit", "label": "Add Study Plan", "action": "submit"}
        ]
    },
    # 8. Civil Engineering
    "civil": {
        "title": "🏗️ Civil Engineering", "description": "Manage material quantities and timelines.",
        "components": [
            {"type": "input", "id": "project", "label": "Project Type"},
            {"type": "input", "id": "materials", "label": "Materials"},
            {"type": "input", "id": "quantity", "label": "Quantity"},
            {"type": "input", "id": "budget", "label": "Budget"},
            {"type": "input", "id": "timeline", "label": "Timeline"},
            {"type": "input", "id": "labor", "label": "Labor Cost"},
            {"type": "button", "id": "submit", "label": "Log Project", "action": "submit"}
        ]
    },
    # 9. Productivity
    "productivity": {
        "title": "🧑‍💼 Productivity", "description": "Manage individual tasks and deadlines.",
        "components": [
            {"type": "input", "id": "task", "label": "Task Name"},
            {"type": "date", "id": "deadline", "label": "Deadline"},
            {"type": "select", "id": "priority", "label": "Priority", "options": ["High", "Medium", "Low"]},
            {"type": "select", "id": "status", "label": "Status", "options": ["Pending", "In Progress", "Done"]},
            {"type": "input", "id": "reminder", "label": "Reminder Time"},
            {"type": "button", "id": "submit", "label": "Add Task", "action": "submit"}
        ]
    },
    # 10. Shopping
    "shopping": {
        "title": "🛒 Shopping", "description": "Keep track of carts and item budgets.",
        "components": [
            {"type": "input", "id": "item", "label": "Item Name"},
            {"type": "input", "id": "quantity", "label": "Quantity"},
            {"type": "input", "id": "budget", "label": "Budget"},
            {"type": "input", "id": "category", "label": "Category"},
            {"type": "select", "id": "priority", "label": "Priority", "options": ["Must-Have", "Want"]},
            {"type": "button", "id": "submit", "label": "Add To Cart", "action": "submit"}
        ]
    },
    # 11. Transportation
    "transport": {
        "title": "🚗 Transportation", "description": "Coordinate logistics and routing efficiently.",
        "components": [
            {"type": "input", "id": "source", "label": "Source"},
            {"type": "input", "id": "dest", "label": "Destination"},
            {"type": "select", "id": "mode", "label": "Mode", "options": ["Car", "Truck", "Air", "Sea"]},
            {"type": "input", "id": "time", "label": "Time"},
            {"type": "input", "id": "distance", "label": "Distance"},
            {"type": "input", "id": "cost", "label": "Cost"},
            {"type": "button", "id": "submit", "label": "Generate Route", "action": "submit"}
        ]
    },
    # 12. Business Management
    "business": {
        "title": "🏢 Business Management", "description": "Oversee enterprise employee roles and statuses.",
        "components": [
            {"type": "input", "id": "employee", "label": "Employee Name"},
            {"type": "input", "id": "role", "label": "Role"},
            {"type": "input", "id": "task", "label": "Task"},
            {"type": "date", "id": "deadline", "label": "Deadline"},
            {"type": "select", "id": "status", "label": "Performance Status", "options": ["Excellent", "Average", "Needs Improvement"]},
            {"type": "button", "id": "submit", "label": "Log Performance", "action": "submit"}
        ]
    },
    # 13. Data Analysis
    "data": {
        "title": "📊 Data Analysis", "description": "Configure visual metrics and data filters.",
        "components": [
            {"type": "input", "id": "dataset", "label": "Dataset Name"},
            {"type": "input", "id": "parameters", "label": "Parameters"},
            {"type": "input", "id": "metrics", "label": "Metrics"},
            {"type": "input", "id": "filters", "label": "Filters"},
            {"type": "select", "id": "vis_type", "label": "Visualization Type", "options": ["Bar Chart", "Line Graph", "Pie Chart", "Scatter"]},
            {"type": "button", "id": "submit", "label": "Plot Data", "action": "submit"}
        ]
    },
    # 14. Event Planning
    "event": {
        "title": "🎉 Event Planning", "description": "Manage guests, budgets, and venue parameters.",
        "components": [
            {"type": "input", "id": "event_name", "label": "Event Name"},
            {"type": "date", "id": "date", "label": "Date"},
            {"type": "input", "id": "guests", "label": "Guests Count"},
            {"type": "input", "id": "budget", "label": "Budget"},
            {"type": "input", "id": "venue", "label": "Venue"},
            {"type": "input", "id": "activities", "label": "Activities"},
            {"type": "button", "id": "submit", "label": "Plan Event", "action": "submit"}
        ]
    },
    # 15. Home Management
    "home": {
        "title": "🏠 Home Management", "description": "Stay on top of bills and residential maintenance.",
        "components": [
            {"type": "input", "id": "bills", "label": "Bills"},
            {"type": "date", "id": "due_date", "label": "Due Date"},
            {"type": "input", "id": "amount", "label": "Amount"},
            {"type": "input", "id": "task", "label": "Maintenance Task"},
            {"type": "select", "id": "frequency", "label": "Frequency", "options": ["Daily", "Weekly", "Monthly"]},
            {"type": "button", "id": "submit", "label": "Update Home Data", "action": "submit"}
        ]
    },
    # 16. Agriculture
    "agriculture": {
        "title": "🌱 Agriculture", "description": "Log crop parameters and fertilizer dependencies.",
        "components": [
            {"type": "input", "id": "crop", "label": "Crop Type"},
            {"type": "input", "id": "soil", "label": "Soil Type"},
            {"type": "input", "id": "location", "label": "Location"},
            {"type": "input", "id": "water", "label": "Water Level"},
            {"type": "input", "id": "fertilizer", "label": "Fertilizer"},
            {"type": "select", "id": "season", "label": "Season", "options": ["Summer", "Winter", "Spring", "Monsoon"]},
            {"type": "button", "id": "submit", "label": "Save Ag-Data", "action": "submit"}
        ]
    },
    # 17. Legal
    "legal": {
        "title": "⚖️ Legal", "description": "Record client documents and case statuses safely.",
        "components": [
            {"type": "input", "id": "doc_type", "label": "Document Type"},
            {"type": "input", "id": "client", "label": "Client Name"},
            {"type": "input", "id": "details", "label": "Case Details"},
            {"type": "date", "id": "deadline", "label": "Deadline"},
            {"type": "select", "id": "status", "label": "Status", "options": ["Open", "Pending", "Closed"]},
            {"type": "button", "id": "submit", "label": "File Record", "action": "submit"}
        ]
    },
    # 18. Mental Wellness
    "wellness": {
        "title": "🧠 Mental Wellness", "description": "Keep mindful track of your emotional equilibrium.",
        "components": [
            {"type": "select", "id": "mood", "label": "Mood", "options": ["Happy", "Neutral", "Sad", "Anxious", "Excited"]},
            {"type": "select", "id": "stress", "label": "Stress Level", "options": ["Low", "Medium", "High"]},
            {"type": "input", "id": "activity", "label": "Activity Done"},
            {"type": "input", "id": "notes", "label": "Notes / Journal"},
            {"type": "date", "id": "date", "label": "Date"},
            {"type": "button", "id": "submit", "label": "Save Entry", "action": "submit"}
        ]
    },
    # 19. Entertainment
    "entertainment": {
        "title": "🎮 Entertainment", "description": "Track consumed media and entertainment metrics.",
        "components": [
            {"type": "input", "id": "content", "label": "Content Type (Movie/Game)"},
            {"type": "input", "id": "genre", "label": "Genre"},
            {"type": "input", "id": "duration", "label": "Duration"},
            {"type": "input", "id": "platform", "label": "Platform"},
            {"type": "select", "id": "rating", "label": "Rating", "options": ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"]},
            {"type": "button", "id": "submit", "label": "Log Media", "action": "submit"}
        ]
    },
    # 20. Social / Collaboration
    "social": {
        "title": "🌍 Social / Collaboration", "description": "Bridge gaps across shared collaborative projects.",
        "components": [
            {"type": "input", "id": "group", "label": "Group Name"},
            {"type": "input", "id": "members", "label": "Members"},
            {"type": "input", "id": "task", "label": "Assigned Task"},
            {"type": "date", "id": "deadline", "label": "Deadline"},
            {"type": "input", "id": "notes", "label": "Shared Notes"},
            {"type": "button", "id": "submit", "label": "Sync Social", "action": "submit"}
        ]
    }
}

@app.route('/api/generate', methods=['POST'])
def generate_ui():
    """ Receives explicit category -> Returns Dynamic UI JSON Schema """
    data = request.json
    intent_key = data.get("intent", "travel")
    
    ui_schema = UI_SCHEMAS.get(intent_key, UI_SCHEMAS["travel"])
    
    return jsonify({
        "success": True,
        "intent_detected": intent_key,
        "ui_schema": ui_schema
    })

@app.route('/api/submit', methods=['POST'])
def submit_data():
    """ Universal backend logic processor for all 20 categories dynamically """
    data = request.json
    intent = data.get("intent", "general")
    form_data = data.get("form_data", {})
    
    return jsonify({
        "success": True,
        "ui_schema": {
            "title": "✅ Data Successfully Processed",
            "description": f"The Engine dynamically saved a '{intent}' payload.",
            "components": [
                {"type": "text", "content": "Raw processed input logic:"},
                {"type": "text", "content": f"{str(form_data)}"},
                {"type": "chart", "percentage": 100},
                {"type": "button", "id": "nav_home", "label": "Return to Dashboard", "action": "reset"}
            ]
        }
    })

if __name__ == '__main__':
    print("Adaptive Intent-to-App Generator Backend Starting...")
    print("Listening on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)

# Start workflow
babel-node prototype/workflow.js --tasklist $(date +%s)

# Start pollers
DEBUG=aries:* aries --decider ./prototype/decider.js --activities ./prototype/activities --tasklist 123456789

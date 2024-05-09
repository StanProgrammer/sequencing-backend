
// Simulate email sending (mock functionality)
const sendEmail = async (emailDetails) => {
    console.log(`Sending email to: ${emailDetails.to}`);
    // Mock email sending
    return new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
};

// Process individual nodes
exports.processNode = async (node, nodes, edges) => {
    switch (node.type) {
        case 'SendEmail':
            await sendEmail(node.data);
            break;
        case 'Wait':
            await new Promise(resolve => setTimeout(resolve, node.data.duration));
            break;
        case 'Decision':
            // Evaluate decision here; simplistically, just move to the next node based on some condition
            return node.data.condition ? node.data.truePath : node.data.falsePath;
    }

    // Find the next node based on edges
    const edge = edges.find(e => e.source === node.id);
    return edge ? edge.target : null;
};

// src/workflows/support/components/ticket-received.ts
import { type Emit } from "../../../motia";

export const subscribe = ["ticket.submitted"];

export async function ticketReceived(
    input: { text: string, userId: string },
    emit: Emit
) {
    console.log("Received ticket:", input);
    const priority = input.text.toLowerCase().includes('urgent') ? 'high' : 'normal';
    
    emit({
        type: "ticket.processed",
        data: {
            text: input.text,
            userId: input.userId,
            priority,
            processedAt: new Date().toISOString()
        }
    });
}

export default ticketReceived;
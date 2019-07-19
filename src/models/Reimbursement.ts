export default class Reimbursement {
    id: number;
    author: number;
    amount: number;
    dateSubmitted: number;
    dateResolved: number;
    description: string;
    resolver: number;
    status: number;
    type: number;
    constructor(obj) {
        if (!obj) return;
        this.id = obj.id;
        this.author = obj.author;
        this.amount = obj.amount;
        this.dateSubmitted = obj.dateSubmitted;
        this.dateResolved = obj.dateResolved;
        this.description = obj.description;
        this.resolver = obj.resolver;
        this.status = obj.status;
        this.type = obj.type;
    }

    static getColumns(): string {
        return 'id, author, amount, date_submitted "dateSubmitted", date_resolved "dateResolved", description, resolver, status, type';
    }
}
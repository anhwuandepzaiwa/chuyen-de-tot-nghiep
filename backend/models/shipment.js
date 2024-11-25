const shipmentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    trackingNumber: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Transit', 'Delivered', 'Failed'], default: 'Pending' },
    estimatedDelivery: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

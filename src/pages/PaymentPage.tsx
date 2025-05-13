import PaymentMethod from '@/components/Payment/PaymentMethod';

const PaymentPage = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <PaymentMethod />
        </div>
    );
};

export default PaymentPage;

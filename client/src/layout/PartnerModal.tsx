import { useState, useEffect} from "react";
import {
    BusinessPartner,
    CreateBusinessPartnerDTO,
    UpdateBusinessPartnerDTO,
} from '../features/partner/types/partner.types';

interface PartnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateBusinessPartnerDTO | UpdateBusinessPartnerDTO) => Promise<void>;
    initialData?: BusinessPartner | null;
}

export default function PartnerModal({isOpen, onClose, onSubmit, initialData}: PartnerModalProps) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [type, setType] = useState<any>('VENDOR');
    const [code, setCode] = useState('');
    const [showModal, setShowModal] = useState(isOpen);
    const [animateIn, setAnimateIn] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isOpen){
            setShowModal(true);
            const timer = setTimeout(() => setAnimateIn(true), 10);
            return () => clearTimeout(timer);
        }else{
            setAnimateIn(false);
            const timer = setTimeout(() => setShowModal(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen])
    useEffect(() => {
        if(initialData){
            setCode(initialData.code);
            setName(initialData.name);
            setType(initialData.type);
            setAddress(initialData.address || '');
            setPhone(initialData.phone || '');
            setEmail(initialData.email || '');
        }else{
            setCode('');
            setName('');
            setType('VENDOR');
            setAddress('');
            setPhone('');
            setEmail('');
        }
    }, [initialData, isOpen])
    if(!showModal) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            setLoading(true);
            await onSubmit({ code, name, type, address, phone, email});
            onClose();
        }catch(err){
            console.error('Gagal menyimpan partner', err);
        }finally{
            setLoading(false);
        }
    };
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-200 ease-out ${animateIn ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {initialData ? 'Edit Akun' : 'Tambah Akun Baru'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Kode Partner</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                            placeholder="Contoh: 1-1100"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                            placeholder="email"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                            placeholder="email"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Nama Partner</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nama"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Adress"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Tipe Akun</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="VENDOR">Vendor</option>
                            <option value="CUSTOMER">Customer</option>
                            <option value="BOTH">Both</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}

import { Bot } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-900 p-2 rounded-lg">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">ESCOMBOT</h1>
                            <p className="text-xs text-gray-500 font-medium tracking-wide">Asistente Virtual Escolar</p>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
                        Prototipo v1.0
                    </div>
                </div>
            </div>
        </header>
    );
}

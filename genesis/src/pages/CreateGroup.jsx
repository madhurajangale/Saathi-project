import { useState } from "react";
import { Users, Sparkles, Copy, CheckCircle } from "lucide-react";
import { getFactoryContract } from "../utils/contract";
const CreateGroup = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [createdPoolAddress, setCreatedPoolAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const handleCreateGroup = async () => {
    try {
      setLoading(true);
      setStatus("Creating Group Pool...");
      setCreatedPoolAddress("");
      const factory = await getFactoryContract();
      const tx = await factory.createGroupPool();
      setStatus("⏳ Waiting for confirmation...");
      const receipt = await tx.wait();
      // Try to get the created pool address from events
      const eventTopic = factory.interface.getEvent("GroupPoolCreated")?.topicHash;
      const event = receipt.logs.find(
        (log) => log.topics[0] === eventTopic
      );
      if (event) {
        const decodedEvent = factory.interface.parseLog({
          topics: event.topics,
          data: event.data,
        });
        if (decodedEvent) {
          setCreatedPoolAddress(decodedEvent.args.groupPool);
        }
      }
      setStatus("✅ Group Pool Created Successfully!");
      alert("Group Pool Created Successfully!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Error creating group");
    } finally {
      setLoading(false);
    }
  };
  const copyAddress = () => {
    navigator.clipboard.writeText(createdPoolAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="w-full max-w-lg bg-gradient-to-br from-slate-900/70 to-slate-950/70 border border-slate-800 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg">
          <Users size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create Group Pool</h2>
          <p className="text-slate-400 text-sm">Start a new community lending pool</p>
        </div>
      </div>
      {/* Feature Info */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 mb-8">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles size={18} className="text-cyan-400" />
          <span className="text-sm">Instantly deploy a decentralized savings group</span>
        </div>
      </div>
      {/* Created Pool Address */}
      {createdPoolAddress && (
        <div className="bg-slate-900/60 border border-green-500/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-400 mb-2">Pool Address:</p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-cyan-400 flex-1 break-all">
              {createdPoolAddress}
            </code>
            <button
              onClick={copyAddress}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {copied ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <Copy size={16} className="text-slate-400" />
              )}
            </button>
          </div>
        </div>
      )}
      {/* Create Button */}
      <button
        onClick={handleCreateGroup}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold rounded-xl
                   hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300
                   shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Pool..." : "Create Pool"}
      </button>
      {/* Status Message */}
      {status && (
        <p className="mt-6 text-center text-sm text-slate-300 font-medium">{status}</p>
      )}
    </div>
  );
};
export default CreateGroup;
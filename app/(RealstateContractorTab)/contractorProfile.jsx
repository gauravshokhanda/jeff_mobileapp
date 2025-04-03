import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { API, baseUrl } from "../../config/apiConfig";

const ContractorProfile = () => {
  const { user_id } = useLocalSearchParams();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [contractorData, setContractorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContractorData = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/users/listing/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setContractorData(response.data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchContractorData();
    }
  }, [user_id, token]);

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sky-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !contractorData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sky-950">
        <div className="bg-sky-900 p-6 rounded-lg shadow-lg">
          <p className="text-white text-lg font-medium">
            {error || "Unable to load contractor profile"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-950">
      {/* Navigation */}
      <nav className="bg-sky-900 shadow-lg p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <button
            onClick={handleBackClick}
            className="text-white hover:text-sky-200 transition-colors flex items-center space-x-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-lg font-medium">Back to Listings</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Banner Section */}
        <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-xl mb-8">
          <img
            src={`${baseUrl}/${contractorData.upload_organisation}`}
            alt={`${contractorData.name}'s banner`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/default-banner.jpg";
            }}
          />
          <div className="absolute inset-0 bg-sky-950 bg-opacity-40"></div>
        </div>

        {/* Profile Card */}
        <div className="max-w-3xl mx-auto -mt-20 relative z-10">
          <div className="bg-sky-900 rounded-lg shadow-xl p-6 border border-sky-800">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
              <div className="relative">
                <img
                  src={`${baseUrl}/${contractorData.image}`}
                  alt={`${contractorData.name}'s profile`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    e.target.src = "/default-profile.jpg";
                  }}
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-white text-3xl font-bold">
                  {contractorData.name}
                </h1>
                <p className="text-sky-300 text-lg font-medium">
                  General Contractor
                </p>
                <p className="text-sky-400 text-sm mt-1">
                  {contractorData.company_name !== "null" 
                    ? contractorData.company_name 
                    : "Independent Contractor"}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sky-300 text-sm font-semibold uppercase tracking-wide">
                  Email
                </p>
                <p className="text-white">{contractorData.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sky-300 text-sm font-semibold uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-white">{contractorData.number}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sky-300 text-sm font-semibold uppercase tracking-wide">
                  Location
                </p>
                <p className="text-white">
                  {contractorData.city}, {contractorData.address}
                </p>
              </div>
              {contractorData.company_registered_number && (
                <div className="space-y-2">
                  <p className="text-sky-300 text-sm font-semibold uppercase tracking-wide">
                    Registration
                  </p>
                  <p className="text-white">{contractorData.company_registered_number}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorProfile;
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { Button } from "@/components/ui/button";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [referralPoint, setReferralPoint] = useState("");
  const [joiningAmount, setJoiningAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "",
    }),
    []
  );

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        // Fetch documents from Firestore
        const referralDoc = await getDoc(doc(db, "settings", "referralPoint"));
        const joiningDoc = await getDoc(doc(db, "settings", "joiningAmount"));
        const howReferralWorksDoc = await getDoc(
          doc(db, "settings", "howReferralWorks")
        );

        // Autofill fields if data exists
        if (referralDoc.exists()) setReferralPoint(referralDoc.data().value);
        if (joiningDoc.exists()) setJoiningAmount(joiningDoc.data().value);
        if (howReferralWorksDoc.exists())
          setContent(howReferralWorksDoc.data().value);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async () => {
    if (!referralPoint || !joiningAmount || !content) {
      alert("All fields are required!");
      return;
    }
    if (isNaN(Number(referralPoint)) || isNaN(Number(joiningAmount))) {
      alert("Referral Point and Joining Amount must be numbers!");
      return;
    }

    setSaving(true);

    try {
      // Save or update each setting in Firestore
      await setDoc(doc(db, "settings", "referralPoint"), {
        type: "referralPoint",
        value: referralPoint,
      });

      await setDoc(doc(db, "settings", "joiningAmount"), {
        type: "joiningAmount",
        value: joiningAmount,
      });

      await setDoc(doc(db, "settings", "howReferralWorks"), {
        type: "howReferralWorks",
        value: content,
      });

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mt-5 mb-4">
            <div>
              <Label>Referral Point</Label>
              <Input
                className="mt-1"
                value={referralPoint}
                onChange={(e) => setReferralPoint(e.target.value)}
              />
            </div>

            <div>
              <Label>Joining Amount</Label>
              <Input
                className="mt-1"
                value={joiningAmount}
                onChange={(e) => setJoiningAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>How Referral Works</Label>
            <JoditEditor
            className="mt-1"
              ref={editor}
              value={content}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
              onChange={(newContent) => {}}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSettings}>
            {" "}
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;

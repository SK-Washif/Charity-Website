"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { getIcon } from "@/lib/iconMap";
import { api } from "@/lib/api";
import DonateButton from "@/components/ui/DonateButton";

export default function Footer() {
  const [cards, setCards] = useState([]);
  const [social, setSocial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const [cardsData, socialData] = await Promise.all([
        api.getContactCards(),
        api.getSocialLinks(),
      ]);

      if (Array.isArray(cardsData) && cardsData.length > 0) {
        setCards(cardsData);
      } else {
        setCards([]);
      }

      if (Array.isArray(socialData) && socialData.length > 0) {
        setSocial(socialData);
      } else {
        setSocial([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch footer data:", error);
      setCards([]);
      setSocial([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-ink text-kraft" role="contentinfo">
      <div className="container-custom mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <h2 className="font-display text-3xl font-bold text-white">
                ঐক্যতান <span className="text-marigold">ফাউন্ডেশন</span>
              </h2>
            </div>
            <p className="text-kraft/60 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              একজন শিক্ষার্থীকে এগিয়ে দেওয়া মানে একটি সম্ভাবনাময় ভবিষ্যৎকে এগিয়ে দেওয়া। <br/>
শিক্ষা, আর্থিক সহায়তা ও ক্যারিয়ার নির্দেশনার মাধ্যমে আমরা গড়ে তুলতে চাই আগামীর সম্ভাবনাময় প্রজন্ম।
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="label-caps mb-4 text-kraft/50 font-semibold tracking-wider">সংস্থা</h3>
            <ul className="space-y-3 font-body text-sm" role="list">
              <li role="listitem">
                <Link href="/#about" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  আমাদের কথা
                </Link>
              </li>
              <li role="listitem">
                <Link href="/#services" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  সেবাসমূহ
                </Link>
              </li>
              <li role="listitem">
                <Link href="/#gallery" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  গ্যালারি
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="label-caps mb-4 text-kraft/50 font-semibold tracking-wider">সহায়তা</h3>
            <ul className="space-y-3 font-body text-sm" role="list">
              <li role="listitem">
                <Link href="/#scholarship" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প
                </Link>
              </li>
              <li role="listitem">
                <Link href="/scholarship" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  শিক্ষাবৃত্তি আবেদন
                </Link>
              </li>
              <li role="listitem">
                <Link href="/#contact" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  যোগাযোগ করুন
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="label-caps mb-4 text-kraft/50 font-semibold tracking-wider">যোগাযোগ</h3>
            
            {cards.length === 0 ? (
              <p className="text-kraft/40 text-sm">যোগাযোগের তথ্য নেই</p>
            ) : (
              <ul className="space-y-3 font-body text-sm" role="list">
                {cards.map((card) => {
                  const Icon = getIcon(card.icon || "FaStar");
                  return (
                    <li key={card.id} className="flex items-center justify-center md:justify-start gap-3 text-kraft/70" role="listitem">
                      <Icon className="text-marigold text-sm flex-shrink-0" aria-hidden="true" />
                      <div>
                        <span className="text-kraft/50 text-xs">{card.label}: </span>
                        <span>{card.value || "—"}</span>
                        {card.note && (
                          <span className="text-kraft/40 text-xs block md:inline md:ml-1">
                            ({card.note})
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {social.length > 0 && (
              <div className="flex justify-center md:justify-start gap-4 mt-6" role="list" aria-label="সোশ্যাল মিডিয়া লিংক">
                {social.map((item) => {
                  const Icon = getIcon(item.icon || "FaGlobe");
                  return (
                    <a
                      key={item.id}
                      href={item.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${item.platform || "সোশ্যাল মিডিয়া"} - নতুন ট্যাবে খুলুন`}
                      className="bg-kraft/10 p-2.5 rounded-full hover:bg-marigold hover:text-ink transition-all duration-300 hover:scale-110"
                      role="listitem"
                    >
                      <Icon className="text-kraft/70 hover:text-ink text-lg" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-kraft/10 bg-gradient-to-r from-marigold/15 via-marigold/5 to-transparent px-6 py-10">
        <div className="container-custom mx-auto flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h3 className="font-display text-xl font-semibold text-white md:text-2xl">
              আপনার একটি ছোট অনুদান বদলে দিতে পারে একজন শিক্ষার্থীর ভবিষ্যৎ
            </h3>
            <p className="mt-2 max-w-lg font-body text-sm text-kraft/60">
              আজই আমাদের পাশে দাঁড়ান এবং শিক্ষার আলো ছড়িয়ে দিতে সহায়তা করুন।
            </p>
          </div>
          <DonateButton className="shrink-0" />
        </div>
      </div>

      <div className="border-t border-kraft/10 px-6 py-5">
        <div className="container-custom mx-auto flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="font-mono text-xs tracking-wide text-kraft/40 text-center md:text-left">
            © {new Date().getFullYear()} ঐক্যতান ফাউন্ডেশন · সর্বস্বত্ব সংরক্ষিত
          </p>
          <p className="font-mono text-xs tracking-wide text-kraft/40 text-center md:text-right">
            অলাভজনক সংস্থা · প্রতিষ্ঠিত ২০২৪
          </p>
        </div>
      </div>
    </footer>
  );
}
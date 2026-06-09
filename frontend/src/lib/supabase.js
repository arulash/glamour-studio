import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

/**
 * Insert a booking, then update it with sequential reference #GS-{1000+id}.
 * Returns the booking_reference on success.
 */
export async function createBooking({
  customer_name,
  customer_phone,
  customer_email,
  services,
  total_price,
  total_duration,
  booking_date,
  booking_time
}) {
  const insertPayload = {
    customer_name,
    customer_phone,
    customer_email: customer_email || null,
    services,
    total_price,
    total_duration,
    booking_date,
    booking_time,
    status: "pending"
  };

  const { data: inserted, error: insertErr } = await supabase
    .from("bookings")
    .insert(insertPayload)
    .select()
    .single();

  if (insertErr) throw insertErr;

  const reference = `GS-${1000 + inserted.id}`;

  const { error: updateErr } = await supabase
    .from("bookings")
    .update({ booking_reference: reference })
    .eq("id", inserted.id);

  if (updateErr) throw updateErr;

  return { reference, id: inserted.id };
}

/** Fetch all booking_time values for a given date (YYYY-MM-DD). */
export async function fetchBookedTimesForDate(dateStr) {
  if (!dateStr) return [];
  const { data, error } = await supabase
    .from("bookings")
    .select("booking_time")
    .eq("booking_date", dateStr);
  if (error) {
    console.error("fetchBookedTimesForDate error", error);
    return [];
  }
  return (data || []).map(r => r.booking_time);
}

/** Fetch all bookings, sorted by date asc, time asc. */
export async function fetchAllBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });
  if (error) {
    console.error("fetchAllBookings error", error);
    return [];
  }
  return data || [];
}

/** Update a single booking's status. */
export async function updateBookingStatus(id, status) {
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
  return true;
}

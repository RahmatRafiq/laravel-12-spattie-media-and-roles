<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AdminUserActivityNotification extends Notification
{
    use Queueable;

    protected $activity;

    /**
     * Buat instance notifikasi baru.
     *
     * @param \Spatie\Activitylog\Models\Activity $activity
     */
    public function __construct($activity)
    {
        $this->activity = $activity;
    }

    /**
     * Tentukan channel notifikasi yang akan digunakan.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Konfigurasi tampilan email notifikasi.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Aktivitas User Baru')
                    ->line('Terdapat aktivitas baru pada data user.')
                    ->line("Deskripsi: {$this->activity->description}")
                    ->action('Lihat Detail', url('/admin/users'))
                    ->line('Terima kasih.');
    }

    /**
     * Format data notifikasi untuk penyimpanan di database.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'activity_id' => $this->activity->id,
            'description' => $this->activity->description,
            'subject_type' => $this->activity->subject_type,
            'subject_id' => $this->activity->subject_id,
            'properties' => $this->activity->properties,
        ];
    }
}

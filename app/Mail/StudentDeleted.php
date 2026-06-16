<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentDeleted extends Mailable
{
    use Queueable, SerializesModels;

    public $student;

    public function __construct($student)
    {
        $this->student = $student;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '⚠️ Student Record Deleted - Student Dashboard',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.student_deleted',
        );
    }
}
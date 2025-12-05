<?php
// app/Models/AdminAccount.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class AdminAccount extends Authenticatable
{
    use Notifiable;

    protected $table = 'admin_accounts';
    protected $fillable = ['username', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];

    /**
     * Casts de atributos.
     *
     * 'password' => 'hashed' asegura que se guarde hasheada automáticamente.
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'email_verified_at' => 'datetime', // si decides agregar verificación de email
        ];
    }
}
